import { Controller, Get, Post, Body, Param, UseGuards, Request, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('payments')
@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a payment' })
  create(@Body() createPaymentDto: CreatePaymentDto, @Request() req) {
    return this.paymentsService.create(createPaymentDto, req.user.id);
  }

  @Post(':id/stripe')
  @ApiOperation({ summary: 'Process Stripe payment' })
  processStripe(@Param('id') id: string, @Request() req) {
    return this.paymentsService.processStripePayment(id, req.user.id, req.user.role);
  }

  @Post(':id/mobile-money')
  @ApiOperation({ summary: 'Process Mobile Money payment' })
  processMobileMoney(@Param('id') id: string, @Request() req) {
    return this.paymentsService.processMobileMoneyPayment(id, req.user.id, req.user.role);
  }

  @Patch(':id/confirm')
  @ApiOperation({ summary: 'Confirm payment - Internal use only' })
  confirm(@Param('id') id: string, @Request() req) {
    return this.paymentsService.confirmPayment(id, req.user.id, req.user.role);
  }

  @Get('my-payments')
  @ApiOperation({ summary: 'Get current user payments' })
  findMyPayments(@Request() req) {
    return this.paymentsService.findByUser(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get payment by ID' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.paymentsService.findOne(id, req.user.id, req.user.role);
  }
}
