import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Credentials } from './schema';
import  { CreateCredentialsDto } from '../dto/create-credentials.dto';

@Injectable()
export class CredentialsService {
  constructor(
    @InjectModel(Credentials.name) 
    private credentialsModel: Model<Credentials>
    ) {}

  async create(createCredentialsDto: CreateCredentialsDto): Promise<Credentials> {
    const createdCredentials = new this.credentialsModel(createCredentialsDto);
    return createdCredentials.save();
  }

  async findAll(): Promise<Credentials[]> {
    return this.credentialsModel.find().exec();
  }

  async findById(id: string): Promise<Credentials | null> {
    return this.credentialsModel.findById(id).exec();
  }
}