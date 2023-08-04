import { Controller, Post, Body, ValidationPipe, Get, Param, NotFoundException } from '@nestjs/common';
import { OfficeService } from './service';
import { CreateOfficeDto } from '../dto/create-office.dto';
import { Office } from './schema';

@Controller('offices')
export class OfficeController {
  constructor(private readonly officeService: OfficeService) {}

  @Post()
  async createOffice(@Body(new ValidationPipe()) createOfficeDto: CreateOfficeDto): Promise<Office> {
    return this.officeService.create(createOfficeDto);
  }

  @Get()
  async getAllOffices(): Promise<Office[]> {
    return this.officeService.findAll();
  }

  @Get(':id')
  async getOfficeById(@Param('id') id: string): Promise<Office> {
    const office = await this.officeService.findById(id);
    if (!office) {
      throw new NotFoundException('Office not found');
    }
    return office;
  }
}
