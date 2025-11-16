import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository, DataSource } from 'typeorm';
import Stripe from 'stripe';
import { Payment, PaymentMethod, PaymentStatus } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { BookingsService } from '../bookings/bookings.service';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    private readonly bookingsService: BookingsService,
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
  ) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2024-12-18.acacia',
    });
  }

  async create(createPaymentDto: CreatePaymentDto, userId: string): Promise<Payment> {
    const booking = await this.bookingsService.findOne(createPaymentDto.bookingId);

    const payment = this.paymentRepository.create({
      ...createPaymentDto,
      userId,
      amount: booking.totalPrice,
      currency: booking.currency,
    });

    return this.paymentRepository.save(payment);
  }

  async processStripePayment(paymentId: string, userId: string, userRole: UserRole): Promise<any> {
    const payment = await this.findOne(paymentId, userId, userRole);

    // Validate ownership
    if (userRole !== UserRole.ADMIN && payment.userId !== userId) {
      throw new ForbiddenException('You do not have permission to process this payment');
    }

    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(payment.amount * 100), // Convert to cents
        currency: payment.currency.toLowerCase(),
        metadata: {
          paymentId: payment.id,
          bookingId: payment.bookingId,
        },
      });

      payment.transactionId = paymentIntent.id;
      payment.status = PaymentStatus.PROCESSING;
      await this.paymentRepository.save(payment);

      return {
        clientSecret: paymentIntent.client_secret,
        paymentId: payment.id,
      };
    } catch (error) {
      payment.status = PaymentStatus.FAILED;
      payment.failureReason = error.message;
      await this.paymentRepository.save(payment);
      throw error;
    }
  }

  async processMobileMoneyPayment(paymentId: string, userId: string, userRole: UserRole): Promise<any> {
    const payment = await this.findOne(paymentId, userId, userRole);

    // Validate ownership
    if (userRole !== UserRole.ADMIN && payment.userId !== userId) {
      throw new ForbiddenException('You do not have permission to process this payment');
    }

    // TODO: Implement actual Mobile Money integration
    // For now, this is a placeholder
    payment.status = PaymentStatus.PROCESSING;
    await this.paymentRepository.save(payment);

    return {
      paymentId: payment.id,
      message: 'Mobile Money payment initiated. Check your phone.',
    };
  }

  async confirmPayment(paymentId: string, userId: string, userRole: UserRole): Promise<Payment> {
    const payment = await this.findOne(paymentId, userId, userRole);

    // Validate ownership
    if (userRole !== UserRole.ADMIN && payment.userId !== userId) {
      throw new ForbiddenException('You do not have permission to confirm this payment');
    }

    // Use a transaction to ensure both payment and booking are updated together
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Update payment status
      payment.status = PaymentStatus.COMPLETED;
      await queryRunner.manager.save(payment);

      // Confirm the booking
      await this.bookingsService.confirm(payment.bookingId, userId, userRole);

      await queryRunner.commitTransaction();

      return payment;
    } catch (error) {
      // Rollback transaction on error
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findOne(id: string, userId?: string, userRole?: UserRole): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: ['user', 'booking'],
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    // Validate resource ownership (unless admin)
    if (userId && userRole !== UserRole.ADMIN && payment.userId !== userId) {
      throw new ForbiddenException('You do not have permission to access this payment');
    }

    return payment;
  }

  async findByUser(userId: string): Promise<Payment[]> {
    return this.paymentRepository.find({
      where: { userId },
      relations: ['booking'],
      order: { createdAt: 'DESC' },
    });
  }
}
