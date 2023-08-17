import { Controller, Post, Body, ValidationPipe, Get, Param, NotFoundException, Put, Delete } from '@nestjs/common';
import { CredentialsService } from '../services/service';
import { CreateCredentialsDto } from '../dto/create-credentials.dto';
import { Credentials } from '../schema';
import { UpdateCredentialsDto } from '../dto/update-credentials.dto';

@Controller('credentials')
export class CredentialsController {
  constructor(private readonly credentialsService: CredentialsService) {}

  @Post()
  async createCredentials(@Body(new ValidationPipe()) createCredentialsDto: CreateCredentialsDto): Promise<Credentials> {
    return this.credentialsService.create(createCredentialsDto);
  }

  @Get()
  async getAllCredentialss(): Promise<Credentials[]> {
    return this.credentialsService.findAll();
  }

  @Get(':id')
  async getCredentialsById(@Param('id') id: string): Promise<Credentials> {
    return this.credentialsService.findById(id);
  }

  @Put(':id')
  async updateCredentials(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateUserDto: UpdateCredentialsDto
  ): Promise<Credentials> {
    return this.credentialsService.updateById(id, updateUserDto);
  }

  @Delete(':id')
  async deleteCredentials(@Param('id') id: string): Promise<Credentials> {
    return this.credentialsService.deleteById(id);
  }
}
