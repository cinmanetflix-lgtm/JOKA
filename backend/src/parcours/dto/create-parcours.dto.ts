import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsArray, IsOptional, IsBoolean } from 'class-validator';

export class CreateParcoursDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsArray()
  waypoints: Array<{
    name: string;
    location: { lat: number; lng: number };
    type: string;
    duration?: number;
  }>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  transportMode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}
