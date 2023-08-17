import mongoose, { Model } from 'mongoose';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Credentials } from '../schema';
import  { CreateCredentialsDto } from '../dto/create-credentials.dto';
import { UpdateCredentialsDto } from '../dto/update-credentials.dto';

@Injectable()
export class CredentialsService {
  constructor(
    @InjectModel(Credentials.name) 
    private credentialsModel: Model<Credentials>
    ) {}

  async create(createCredentialsDto: CreateCredentialsDto): Promise<Credentials> {
    return this.credentialsModel.create(createCredentialsDto);
  }

  async findAll(): Promise<Credentials[]> {
    return this.credentialsModel.find().exec();
  }

  async findById(id: string): Promise<Credentials> {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Invalid credentials ID');
    }

    const credentials = await this.credentialsModel.findById(id);

    if (!credentials) {
      throw new NotFoundException('Credentials not found.');
    }

    return credentials;
  }
  
  async updateById(id: string, updateCredentialsDto: UpdateCredentialsDto): Promise<Credentials | null> {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Invalid credentials ID');
    }

    const updatedCredentials = await this.credentialsModel
      .findByIdAndUpdate(id, updateCredentialsDto, { new: true })
      .exec();
    
    if (!updatedCredentials) {
        throw new NotFoundException('Credentials not found');
    }

    return updatedCredentials;
  }

  async deleteById(id: string): Promise<Credentials> {
    if (!mongoose.isValidObjectId(id)) {
        throw new BadRequestException('Invalid credentials ID');
    }
    
    const deletedCredentials = await this.credentialsModel.findByIdAndDelete(id);
    
    if (!deletedCredentials) {
        throw new NotFoundException('Credentials not found');
    }

    return deletedCredentials;
  }
}