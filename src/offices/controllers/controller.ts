import { Controller, Post, Body, ValidationPipe, Get, Param, NotFoundException, Put, Delete } from '@nestjs/common';
import { OfficeService } from '../services/service';
import { CreateOfficeDto } from '../dto/create-office.dto';
import { Office } from '../schema';
import { UpdateOfficeDto } from '../dto/update-office.dto';

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
    return this.officeService.findById(id);
  }

  @Put(':id')
  async updateOffice(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateUserDto: UpdateOfficeDto
  ): Promise<Office> {
    return this.officeService.updateById(id, updateUserDto);
  }

  @Delete(':id')
  async deleteOffice(@Param('id') id: string): Promise<Office> {
    return this.officeService.deleteById(id);
  }
}
