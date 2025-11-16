import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParcoursService } from './parcours.service';
import { ParcoursController } from './parcours.controller';
import { Parcours } from './entities/parcours.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Parcours])],
  controllers: [ParcoursController],
  providers: [ParcoursService],
})
export class ParcoursModule {}
