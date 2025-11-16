import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service, ServiceCategory, ServiceStatus } from './entities/service.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { SearchServicesDto } from './dto/search-services.dto';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
  ) {}

  async create(createServiceDto: CreateServiceDto, partnerId: string): Promise<Service> {
    const service = this.serviceRepository.create({
      ...createServiceDto,
      partnerId,
    });
    return this.serviceRepository.save(service);
  }

  async findAll(): Promise<Service[]> {
    return this.serviceRepository.find({
      relations: ['partner'],
      where: { status: ServiceStatus.ACTIVE, isAvailable: true },
    });
  }

  async search(searchDto: SearchServicesDto): Promise<Service[]> {
    const query = this.serviceRepository.createQueryBuilder('service');

    if (searchDto.category) {
      query.andWhere('service.category = :category', { category: searchDto.category });
    }

    if (searchDto.minPrice !== undefined) {
      query.andWhere('service.basePrice >= :minPrice', { minPrice: searchDto.minPrice });
    }

    if (searchDto.maxPrice !== undefined) {
      query.andWhere('service.basePrice <= :maxPrice', { maxPrice: searchDto.maxPrice });
    }

    if (searchDto.city) {
      query.andWhere('service.city ILIKE :city', { city: `%${searchDto.city}%` });
    }

    if (searchDto.keyword) {
      query.andWhere(
        '(service.name ILIKE :keyword OR service.description ILIKE :keyword)',
        { keyword: `%${searchDto.keyword}%` }
      );
    }

    query.andWhere('service.status = :status', { status: ServiceStatus.ACTIVE });
    query.andWhere('service.isAvailable = :available', { available: true });

    return query.getMany();
  }

  async findOne(id: string): Promise<Service> {
    const service = await this.serviceRepository.findOne({
      where: { id },
      relations: ['partner'],
    });

    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }

    return service;
  }

  async update(id: string, updateServiceDto: UpdateServiceDto): Promise<Service> {
    const service = await this.findOne(id);
    Object.assign(service, updateServiceDto);
    return this.serviceRepository.save(service);
  }

  async remove(id: string): Promise<void> {
    const service = await this.findOne(id);
    await this.serviceRepository.remove(service);
  }

  async findByPartner(partnerId: string): Promise<Service[]> {
    return this.serviceRepository.find({ where: { partnerId } });
  }
}
