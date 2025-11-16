import { Controller, Get, Post, Body, Param, UseGuards, Request, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('payments')
@Controller('payments')
@UseGuards(JwtAuthGuard)
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
  processStripe(@Param('id') id: string) {
    return this.paymentsService.processStripePayment(id);
  }

  @Post(':id/mobile-money')
  @ApiOperation({ summary: 'Process Mobile Money payment' })
  processMobileMoney(@Param('id') id: string) {
    return this.paymentsService.processMobileMoneyPayment(id);
  }

  @Patch(':id/confirm')
  @ApiOperation({ summary: 'Confirm payment' })
  confirm(@Param('id') id: string) {
    return this.paymentsService.confirmPayment(id);
  }

  @Get('my-payments')
  @ApiOperation({ summary: 'Get current user payments' })
  findMyPayments(@Request() req) {
    return this.paymentsService.findByUser(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get payment by ID' })
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(id);
  }
}
