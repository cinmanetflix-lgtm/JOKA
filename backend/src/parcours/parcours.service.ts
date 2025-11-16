import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Parcours } from './entities/parcours.entity';
import { CreateParcoursDto } from './dto/create-parcours.dto';

@Injectable()
export class ParcoursService {
  constructor(
    @InjectRepository(Parcours)
    private readonly parcoursRepository: Repository<Parcours>,
  ) {}

  async create(createParcoursDto: CreateParcoursDto, userId: string): Promise<Parcours> {
    const parcours = this.parcoursRepository.create({
      ...createParcoursDto,
      userId,
    });
    return this.parcoursRepository.save(parcours);
  }

  async findAll(): Promise<Parcours[]> {
    return this.parcoursRepository.find({ where: { isPublic: true } });
  }

  async findByUser(userId: string): Promise<Parcours[]> {
    return this.parcoursRepository.find({ where: { userId } });
  }

  async findOne(id: string): Promise<Parcours> {
    return this.parcoursRepository.findOne({ where: { id } });
  }
}
