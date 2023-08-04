import { Controller, Post, Body, ValidationPipe, Get, Param, NotFoundException } from '@nestjs/common';
import { CredentialsService } from './service';
import { CreateCredentialsDto } from '../dto/create-credentials.dto';
import { Credentials } from './schema';

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
    const credentials = await this.credentialsService.findById(id);
    if (!credentials) {
      throw new NotFoundException('Credentials not found');
    }
    return credentials;
  }
}
