import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('bookings')
@Controller('bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new booking' })
  create(@Body() createBookingDto: CreateBookingDto, @Request() req) {
    return this.bookingsService.create(createBookingDto, req.user.id);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all bookings (Admin only)' })
  findAll() {
    return this.bookingsService.findAll();
  }

  @Get('my-bookings')
  @ApiOperation({ summary: 'Get current user bookings' })
  findMyBookings(@Request() req) {
    return this.bookingsService.findByUser(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booking by ID' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.bookingsService.findOne(id, req.user.id, req.user.role);
  }

  @Patch(':id/confirm')
  @ApiOperation({ summary: 'Confirm booking (after payment) - Internal use only' })
  confirm(@Param('id') id: string, @Request() req) {
    return this.bookingsService.confirm(id, req.user.id, req.user.role);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel booking' })
  cancel(@Param('id') id: string, @Body() body: { reason?: string }, @Request() req) {
    return this.bookingsService.cancel(id, body.reason, req.user.id, req.user.role);
  }

  @Patch(':id/validate')
  @Roles(UserRole.PARTNER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Validate booking (Partner scans QR code)' })
  validate(@Param('id') id: string, @Request() req) {
    return this.bookingsService.validate(id, req.user.id);
  }
}
