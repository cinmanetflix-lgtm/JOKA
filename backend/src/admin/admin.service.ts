import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ServicesService } from '../services/services.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly usersService: UsersService,
    private readonly servicesService: ServicesService,
  ) {}

  async getDashboardStats() {
    const users = await this.usersService.findAll();
    const services = await this.servicesService.findAll();

    return {
      totalUsers: users.length,
      totalPartners: users.filter(u => u.role === 'partner').length,
      totalServices: services.length,
      activeServices: services.filter(s => s.isAvailable).length,
    };
  }
}
