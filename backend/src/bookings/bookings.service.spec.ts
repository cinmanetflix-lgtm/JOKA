import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingsService } from './bookings.service';
import { Booking, BookingStatus } from './entities/booking.entity';
import { QRCodeService } from '../common/services/qrcode.service';
import { PDFService } from '../common/services/pdf.service';
import { ServicesService } from '../services/services.service';
import { UserRole } from '../users/entities/user.entity';
import { CreateBookingDto } from './dto/create-booking.dto';

describe('BookingsService', () => {
  let service: BookingsService;
  let bookingRepository: Repository<Booking>;
  let servicesService: ServicesService;
  let qrCodeService: QRCodeService;
  let pdfService: PDFService;

  const mockBookingRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockServicesService = {
    findOne: jest.fn(),
  };

  const mockQRCodeService = {
    generateQRCode: jest.fn(),
  };

  const mockPDFService = {
    generateTicketPDF: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        {
          provide: getRepositoryToken(Booking),
          useValue: mockBookingRepository,
        },
        {
          provide: ServicesService,
          useValue: mockServicesService,
        },
        {
          provide: QRCodeService,
          useValue: mockQRCodeService,
        },
        {
          provide: PDFService,
          useValue: mockPDFService,
        },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
    bookingRepository = module.get<Repository<Booking>>(
      getRepositoryToken(Booking),
    );
    servicesService = module.get<ServicesService>(ServicesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findOne', () => {
    const bookingId = 'booking-123';
    const userId = 'user-123';

    it('should return a booking for the owner', async () => {
      const booking = {
        id: bookingId,
        userId: userId,
        status: BookingStatus.PENDING,
      };

      mockBookingRepository.findOne.mockResolvedValue(booking);

      const result = await service.findOne(bookingId, userId, UserRole.USER);

      expect(result).toEqual(booking);
    });

    it('should return a booking for admin regardless of ownership', async () => {
      const booking = {
        id: bookingId,
        userId: 'different-user',
        status: BookingStatus.PENDING,
      };

      mockBookingRepository.findOne.mockResolvedValue(booking);

      const result = await service.findOne(bookingId, userId, UserRole.ADMIN);

      expect(result).toEqual(booking);
    });

    it('should throw ForbiddenException if user does not own the booking', async () => {
      const booking = {
        id: bookingId,
        userId: 'different-user',
        status: BookingStatus.PENDING,
      };

      mockBookingRepository.findOne.mockResolvedValue(booking);

      await expect(
        service.findOne(bookingId, userId, UserRole.USER),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException if booking does not exist', async () => {
      mockBookingRepository.findOne.mockResolvedValue(null);

      await expect(
        service.findOne(bookingId, userId, UserRole.USER),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('confirm', () => {
    const bookingId = 'booking-123';
    const userId = 'user-123';

    it('should confirm a booking for the owner', async () => {
      const booking = {
        id: bookingId,
        userId: userId,
        status: BookingStatus.PENDING,
      };

      mockBookingRepository.findOne.mockResolvedValue(booking);
      mockPDFService.generateTicketPDF.mockResolvedValue(Buffer.from('pdf'));
      mockBookingRepository.save.mockResolvedValue({
        ...booking,
        status: BookingStatus.CONFIRMED,
      });

      const result = await service.confirm(bookingId, userId, UserRole.USER);

      expect(result.status).toBe(BookingStatus.CONFIRMED);
      expect(mockPDFService.generateTicketPDF).toHaveBeenCalledWith(booking);
    });

    it('should allow admin to confirm any booking', async () => {
      const booking = {
        id: bookingId,
        userId: 'different-user',
        status: BookingStatus.PENDING,
      };

      mockBookingRepository.findOne.mockResolvedValue(booking);
      mockPDFService.generateTicketPDF.mockResolvedValue(Buffer.from('pdf'));
      mockBookingRepository.save.mockResolvedValue({
        ...booking,
        status: BookingStatus.CONFIRMED,
      });

      const result = await service.confirm(bookingId, userId, UserRole.ADMIN);

      expect(result.status).toBe(BookingStatus.CONFIRMED);
    });

    it('should throw ForbiddenException if user does not own the booking', async () => {
      const booking = {
        id: bookingId,
        userId: 'different-user',
        status: BookingStatus.PENDING,
      };

      mockBookingRepository.findOne.mockResolvedValue(booking);

      await expect(
        service.confirm(bookingId, userId, UserRole.USER),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('cancel', () => {
    const bookingId = 'booking-123';
    const userId = 'user-123';
    const reason = 'Changed plans';

    it('should cancel a booking for the owner', async () => {
      const booking = {
        id: bookingId,
        userId: userId,
        status: BookingStatus.CONFIRMED,
      };

      mockBookingRepository.findOne.mockResolvedValue(booking);
      mockBookingRepository.save.mockResolvedValue({
        ...booking,
        status: BookingStatus.CANCELLED,
        cancellationReason: reason,
      });

      const result = await service.cancel(bookingId, reason, userId, UserRole.USER);

      expect(result.status).toBe(BookingStatus.CANCELLED);
      expect(result.cancellationReason).toBe(reason);
    });

    it('should throw ForbiddenException if user does not own the booking', async () => {
      const booking = {
        id: bookingId,
        userId: 'different-user',
        status: BookingStatus.CONFIRMED,
      };

      mockBookingRepository.findOne.mockResolvedValue(booking);

      await expect(
        service.cancel(bookingId, reason, userId, UserRole.USER),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('findByUser', () => {
    it('should return all bookings for a user', async () => {
      const userId = 'user-123';
      const bookings = [
        { id: '1', userId, status: BookingStatus.CONFIRMED },
        { id: '2', userId, status: BookingStatus.PENDING },
      ];

      mockBookingRepository.find.mockResolvedValue(bookings);

      const result = await service.findByUser(userId);

      expect(result).toEqual(bookings);
      expect(mockBookingRepository.find).toHaveBeenCalledWith({
        where: { userId },
        relations: ['service'],
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('create', () => {
    it('should create a booking with QR code', async () => {
      const userId = 'user-123';
      const createBookingDto: CreateBookingDto = {
        serviceId: 'service-123',
        bookingDate: new Date(),
        quantity: 2,
      };

      const serviceData = {
        id: 'service-123',
        basePrice: 1000,
        currency: 'XOF',
      };

      const booking = {
        id: 'booking-123',
        userId,
        ...createBookingDto,
        totalPrice: 2000,
        currency: 'XOF',
      };

      mockServicesService.findOne.mockResolvedValue(serviceData);
      mockBookingRepository.create.mockReturnValue(booking);
      mockBookingRepository.save.mockResolvedValue(booking);
      mockQRCodeService.generateQRCode.mockResolvedValue('qr-code-data');

      const result = await service.create(createBookingDto, userId);

      expect(result.totalPrice).toBe(2000);
      expect(result.qrCode).toBe('qr-code-data');
      expect(mockQRCodeService.generateQRCode).toHaveBeenCalledWith(
        `JOKA-${booking.id}`,
      );
    });
  });
});
