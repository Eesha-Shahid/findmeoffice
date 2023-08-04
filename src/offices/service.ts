import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Office } from './schema';
import  { CreateOfficeDto } from '../dto/create-office.dto';

@Injectable()
export class OfficeService {
  constructor(
    @InjectModel(Office.name) 
    private userModel: Model<Office>
    ) {}

  async create(createOfficeDto: CreateOfficeDto): Promise<Office> {
    const createdOffice = new this.userModel(createOfficeDto);
    return createdOffice.save();
  }

  async findAll(): Promise<Office[]> {
    return this.userModel.find().exec();
  }

  async findById(id: string): Promise<Office | null> {
    return this.userModel.findById(id).exec();
  }
}