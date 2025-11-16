import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ParcoursService } from './parcours.service';
import { CreateParcoursDto } from './dto/create-parcours.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('parcours')
@Controller('parcours')
export class ParcoursController {
  constructor(private readonly parcoursService: ParcoursService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new parcours' })
  create(@Body() createParcoursDto: CreateParcoursDto, @Request() req) {
    return this.parcoursService.create(createParcoursDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all public parcours' })
  findAll() {
    return this.parcoursService.findAll();
  }

  @Get('my-parcours')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user parcours' })
  findMyParcours(@Request() req) {
    return this.parcoursService.findByUser(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get parcours by ID' })
  findOne(@Param('id') id: string) {
    return this.parcoursService.findOne(id);
  }
}
