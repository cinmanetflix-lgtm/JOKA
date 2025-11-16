import { Injectable } from '@nestjs/common';
import { ServicesService } from '../services/services.service';

@Injectable()
export class PartnersService {
  constructor(private readonly servicesService: ServicesService) {}

  async getPartnerServices(partnerId: string) {
    return this.servicesService.findByPartner(partnerId);
  }

  async getPartnerStats(partnerId: string) {
    const services = await this.servicesService.findByPartner(partnerId);

    return {
      totalServices: services.length,
      activeServices: services.filter(s => s.isAvailable).length,
      averageRating: services.reduce((acc, s) => acc + Number(s.rating), 0) / services.length || 0,
      totalReviews: services.reduce((acc, s) => acc + s.reviewCount, 0),
    };
  }
}
