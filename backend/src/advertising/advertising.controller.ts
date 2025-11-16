import { Controller, Get, Post, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AdvertisingService } from './advertising.service';

@ApiTags('advertising')
@Controller('advertising')
export class AdvertisingController {
  constructor(private readonly advertisingService: AdvertisingService) {}

  @Get('active')
  @ApiOperation({ summary: 'Get active advertisements' })
  getActiveAds() {
    return this.advertisingService.getActiveAds();
  }

  @Post(':id/view')
  @ApiOperation({ summary: 'Track advertisement view' })
  trackView(@Param('id') id: string) {
    return this.advertisingService.trackView(id);
  }

  @Post(':id/click')
  @ApiOperation({ summary: 'Track advertisement click' })
  trackClick(@Param('id') id: string) {
    return this.advertisingService.trackClick(id);
  }
}
