import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UsersModule } from '../users/users.module';
import { ServicesModule } from '../services/services.module';

@Module({
  imports: [UsersModule, ServicesModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
