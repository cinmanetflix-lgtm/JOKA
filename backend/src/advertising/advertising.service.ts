import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Advertisement } from './entities/advertisement.entity';

@Injectable()
export class AdvertisingService {
  constructor(
    @InjectRepository(Advertisement)
    private readonly advertisementRepository: Repository<Advertisement>,
  ) {}

  async getActiveAds(): Promise<Advertisement[]> {
    const today = new Date();
    return this.advertisementRepository.find({
      where: {
        isActive: true,
        startDate: LessThanOrEqual(today),
        endDate: MoreThanOrEqual(today),
      },
    });
  }

  async trackView(adId: string): Promise<void> {
    await this.advertisementRepository.increment({ id: adId }, 'views', 1);
  }

  async trackClick(adId: string): Promise<void> {
    await this.advertisementRepository.increment({ id: adId }, 'clicks', 1);
  }
}
