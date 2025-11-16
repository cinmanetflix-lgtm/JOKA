import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import Stripe from 'stripe';
import { Payment, PaymentMethod, PaymentStatus } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { BookingsService } from '../bookings/bookings.service';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    private readonly bookingsService: BookingsService,
    private readonly configService: ConfigService,
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

  async processStripePayment(paymentId: string): Promise<any> {
    const payment = await this.findOne(paymentId);

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

  async processMobileMoneyPayment(paymentId: string): Promise<any> {
    const payment = await this.findOne(paymentId);

    // TODO: Implement actual Mobile Money integration
    // For now, this is a placeholder
    payment.status = PaymentStatus.PROCESSING;
    await this.paymentRepository.save(payment);

    return {
      paymentId: payment.id,
      message: 'Mobile Money payment initiated. Check your phone.',
    };
  }

  async confirmPayment(paymentId: string): Promise<Payment> {
    const payment = await this.findOne(paymentId);
    payment.status = PaymentStatus.COMPLETED;
    await this.paymentRepository.save(payment);

    // Confirm the booking
    await this.bookingsService.confirm(payment.bookingId);

    return payment;
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: ['user', 'booking'],
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
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
