import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum ServiceCategory {
  RESTAURANT = 'restaurant',
  ACCOMMODATION = 'accommodation',
  LEISURE = 'leisure',
  WELLNESS = 'wellness',
  TRANSPORT = 'transport',
  EVENT = 'event',
  COMMERCE = 'commerce',
}

export enum ServiceStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
}

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: ServiceCategory })
  category: ServiceCategory;

  @Column({ type: 'simple-array' })
  images: string[];

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  basePrice: number;

  @Column({ default: 'XOF' })
  currency: string;

  @Column({ type: 'point' })
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };

  @Column()
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  country: string;

  @Column({ type: 'jsonb', nullable: true })
  contact: {
    phone: string;
    email: string;
    website?: string;
  };

  @Column({ type: 'jsonb', nullable: true })
  openingHours: {
    [key: string]: { open: string; close: string };
  };

  @Column({ type: 'jsonb', nullable: true })
  amenities: string[];

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating: number;

  @Column({ default: 0 })
  reviewCount: number;

  @Column({ type: 'enum', enum: ServiceStatus, default: ServiceStatus.PENDING })
  status: ServiceStatus;

  @Column({ default: true })
  isAvailable: boolean;

  @Column({ default: false })
  deliveryAvailable: boolean;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'partnerId' })
  partner: User;

  @Column()
  partnerId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
