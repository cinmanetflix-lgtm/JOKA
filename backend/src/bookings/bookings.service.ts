import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking, BookingStatus } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { QRCodeService } from '../common/services/qrcode.service';
import { PDFService } from '../common/services/pdf.service';
import { ServicesService } from '../services/services.service';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    private readonly qrCodeService: QRCodeService,
    private readonly pdfService: PDFService,
    private readonly servicesService: ServicesService,
  ) {}

  async create(createBookingDto: CreateBookingDto, userId: string): Promise<Booking> {
    const service = await this.servicesService.findOne(createBookingDto.serviceId);

    const totalPrice = service.basePrice * createBookingDto.quantity;

    const booking = this.bookingRepository.create({
      ...createBookingDto,
      userId,
      totalPrice,
      currency: service.currency,
    });

    const savedBooking = await this.bookingRepository.save(booking);

    // Generate QR code
    const qrCodeData = `JOKA-${savedBooking.id}`;
    const qrCode = await this.qrCodeService.generateQRCode(qrCodeData);
    savedBooking.qrCode = qrCode;

    // Generate PDF ticket (will be generated after payment confirmation)
    // This is a placeholder for now
    savedBooking.pdfTicket = `https://storage.joka.ci/tickets/${savedBooking.id}.pdf`;

    return this.bookingRepository.save(savedBooking);
  }

  async findAll(): Promise<Booking[]> {
    return this.bookingRepository.find({
      relations: ['user', 'service'],
    });
  }

  async findByUser(userId: string): Promise<Booking[]> {
    return this.bookingRepository.find({
      where: { userId },
      relations: ['service'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId?: string, userRole?: UserRole): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['user', 'service'],
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    // Validate resource ownership (unless admin)
    if (userId && userRole !== UserRole.ADMIN && booking.userId !== userId) {
      throw new ForbiddenException('You do not have permission to access this booking');
    }

    return booking;
  }

  async confirm(id: string, userId?: string, userRole?: UserRole): Promise<Booking> {
    const booking = await this.findOne(id, userId, userRole);

    // Only allow confirmation by the booking owner or admin
    if (userId && userRole !== UserRole.ADMIN && booking.userId !== userId) {
      throw new ForbiddenException('You do not have permission to confirm this booking');
    }

    booking.status = BookingStatus.CONFIRMED;

    // Generate PDF ticket
    const pdfBuffer = await this.pdfService.generateTicketPDF(booking);
    // Upload to cloud storage (placeholder)
    booking.pdfTicket = `https://storage.joka.ci/tickets/${booking.id}.pdf`;

    return this.bookingRepository.save(booking);
  }

  async cancel(id: string, reason?: string, userId?: string, userRole?: UserRole): Promise<Booking> {
    const booking = await this.findOne(id, userId, userRole);

    // Only allow cancellation by the booking owner or admin
    if (userId && userRole !== UserRole.ADMIN && booking.userId !== userId) {
      throw new ForbiddenException('You do not have permission to cancel this booking');
    }

    booking.status = BookingStatus.CANCELLED;
    booking.cancellationReason = reason;
    return this.bookingRepository.save(booking);
  }

  async validate(id: string, validatedBy: string): Promise<Booking> {
    const booking = await this.findOne(id);
    booking.validatedAt = new Date();
    booking.validatedBy = validatedBy;
    booking.status = BookingStatus.COMPLETED;
    return this.bookingRepository.save(booking);
  }
}
