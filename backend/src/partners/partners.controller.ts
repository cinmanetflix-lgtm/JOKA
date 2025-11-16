import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PartnersService } from './partners.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('partners')
@Controller('partners')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PartnersController {
  constructor(private readonly partnersService: PartnersService) {}

  @Get('my-services')
  @ApiOperation({ summary: 'Get partner services' })
  getMyServices(@Request() req) {
    return this.partnersService.getPartnerServices(req.user.id);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get partner statistics' })
  getStats(@Request() req) {
    return this.partnersService.getPartnerStats(req.user.id);
  }
}
