import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { PaymentsService } from './payments.service';
import { Payment, PaymentStatus, PaymentMethod } from './entities/payment.entity';
import { BookingsService } from '../bookings/bookings.service';
import { UserRole } from '../users/entities/user.entity';

describe('PaymentsService', () => {
  let service: PaymentsService;
  let paymentRepository: Repository<Payment>;
  let bookingsService: BookingsService;
  let dataSource: DataSource;

  const mockPaymentRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockBookingsService = {
    findOne: jest.fn(),
    confirm: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue('sk_test_dummy_key'),
  };

  const mockQueryRunner = {
    connect: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
    manager: {
      save: jest.fn(),
    },
  };

  const mockDataSource = {
    createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        {
          provide: getRepositoryToken(Payment),
          useValue: mockPaymentRepository,
        },
        {
          provide: BookingsService,
          useValue: mockBookingsService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    paymentRepository = module.get<Repository<Payment>>(
      getRepositoryToken(Payment),
    );
    bookingsService = module.get<BookingsService>(BookingsService);
    dataSource = module.get<DataSource>(DataSource);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findOne', () => {
    const paymentId = 'payment-123';
    const userId = 'user-123';

    it('should return a payment for the owner', async () => {
      const payment = {
        id: paymentId,
        userId: userId,
        status: PaymentStatus.PENDING,
      };

      mockPaymentRepository.findOne.mockResolvedValue(payment);

      const result = await service.findOne(paymentId, userId, UserRole.USER);

      expect(result).toEqual(payment);
    });

    it('should return a payment for admin regardless of ownership', async () => {
      const payment = {
        id: paymentId,
        userId: 'different-user',
        status: PaymentStatus.PENDING,
      };

      mockPaymentRepository.findOne.mockResolvedValue(payment);

      const result = await service.findOne(paymentId, userId, UserRole.ADMIN);

      expect(result).toEqual(payment);
    });

    it('should throw ForbiddenException if user does not own the payment', async () => {
      const payment = {
        id: paymentId,
        userId: 'different-user',
        status: PaymentStatus.PENDING,
      };

      mockPaymentRepository.findOne.mockResolvedValue(payment);

      await expect(
        service.findOne(paymentId, userId, UserRole.USER),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException if payment does not exist', async () => {
      mockPaymentRepository.findOne.mockResolvedValue(null);

      await expect(
        service.findOne(paymentId, userId, UserRole.USER),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('confirmPayment', () => {
    const paymentId = 'payment-123';
    const userId = 'user-123';
    const bookingId = 'booking-123';

    it('should confirm payment and booking in a transaction', async () => {
      const payment = {
        id: paymentId,
        userId: userId,
        bookingId: bookingId,
        status: PaymentStatus.PROCESSING,
      };

      mockPaymentRepository.findOne.mockResolvedValue(payment);
      mockQueryRunner.manager.save.mockResolvedValue({
        ...payment,
        status: PaymentStatus.COMPLETED,
      });
      mockBookingsService.confirm.mockResolvedValue({});

      const result = await service.confirmPayment(paymentId, userId, UserRole.USER);

      expect(result.status).toBe(PaymentStatus.COMPLETED);
      expect(mockQueryRunner.connect).toHaveBeenCalled();
      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
      expect(mockBookingsService.confirm).toHaveBeenCalledWith(
        bookingId,
        userId,
        UserRole.USER,
      );
    });

    it('should rollback transaction on error', async () => {
      const payment = {
        id: paymentId,
        userId: userId,
        bookingId: bookingId,
        status: PaymentStatus.PROCESSING,
      };

      mockPaymentRepository.findOne.mockResolvedValue(payment);
      mockQueryRunner.manager.save.mockResolvedValue({
        ...payment,
        status: PaymentStatus.COMPLETED,
      });
      mockBookingsService.confirm.mockRejectedValue(new Error('Booking error'));

      await expect(
        service.confirmPayment(paymentId, userId, UserRole.USER),
      ).rejects.toThrow('Booking error');

      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });

    it('should throw ForbiddenException if user does not own the payment', async () => {
      const payment = {
        id: paymentId,
        userId: 'different-user',
        bookingId: bookingId,
        status: PaymentStatus.PROCESSING,
      };

      mockPaymentRepository.findOne.mockResolvedValue(payment);

      await expect(
        service.confirmPayment(paymentId, userId, UserRole.USER),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('processStripePayment', () => {
    const paymentId = 'payment-123';
    const userId = 'user-123';

    it('should process stripe payment for the owner', async () => {
      const payment = {
        id: paymentId,
        userId: userId,
        amount: 1000,
        currency: 'XOF',
        status: PaymentStatus.PENDING,
      };

      mockPaymentRepository.findOne.mockResolvedValue(payment);
      mockPaymentRepository.save.mockResolvedValue({
        ...payment,
        status: PaymentStatus.PROCESSING,
      });

      // Mock Stripe payment intent creation
      const mockStripe = {
        paymentIntents: {
          create: jest.fn().mockResolvedValue({
            id: 'pi_123',
            client_secret: 'secret_123',
          }),
        },
      };
      (service as any).stripe = mockStripe;

      const result = await service.processStripePayment(
        paymentId,
        userId,
        UserRole.USER,
      );

      expect(result.clientSecret).toBe('secret_123');
      expect(result.paymentId).toBe(paymentId);
    });

    it('should throw ForbiddenException if user does not own the payment', async () => {
      const payment = {
        id: paymentId,
        userId: 'different-user',
        status: PaymentStatus.PENDING,
      };

      mockPaymentRepository.findOne.mockResolvedValue(payment);

      await expect(
        service.processStripePayment(paymentId, userId, UserRole.USER),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('findByUser', () => {
    it('should return all payments for a user', async () => {
      const userId = 'user-123';
      const payments = [
        { id: '1', userId, status: PaymentStatus.COMPLETED },
        { id: '2', userId, status: PaymentStatus.PENDING },
      ];

      mockPaymentRepository.find.mockResolvedValue(payments);

      const result = await service.findByUser(userId);

      expect(result).toEqual(payments);
      expect(mockPaymentRepository.find).toHaveBeenCalledWith({
        where: { userId },
        relations: ['booking'],
        order: { createdAt: 'DESC' },
      });
    });
  });
});
