import { Module } from '@nestjs/common';
import { PartnersController } from './partners.controller';
import { PartnersService } from './partners.service';
import { ServicesModule } from '../services/services.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [ServicesModule, UsersModule],
  controllers: [PartnersController],
  providers: [PartnersService],
})
export class PartnersModule {}
