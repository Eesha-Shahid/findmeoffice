import mongoose, { Model } from 'mongoose';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Office } from '../schema';
import  { CreateOfficeDto } from '../dto/create-office.dto';
import { UpdateOfficeDto } from '../dto/update-office.dto';
import { User } from '../../users/schema';

@Injectable()
export class OfficeService {
  constructor(
    @InjectModel(Office.name) 
    private officeModel: Model<Office>
    ) {}

  async create(
    createOfficeDto: CreateOfficeDto,
    owner: User
    ): Promise<Office> {

    const data = Object.assign(createOfficeDto, { owner: owner._id })
    return this.officeModel.create(data);
  }

  async findAll(ownerId: string): Promise<Office[]> {
    return this.officeModel.find({ owner: ownerId }).exec();
  }

  async findById(id: string): Promise<Office> {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Invalid office ID');
    }

    const office = await this.officeModel.findById(id);

    if (!office) {
      throw new NotFoundException('Office not found.');
    }

    return office;
  }
  
  async updateById(id: string, updateOfficeDto: UpdateOfficeDto): Promise<Office | null> {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Invalid office ID');
    }

    const updatedOffice = await this.officeModel
      .findByIdAndUpdate(id, updateOfficeDto, { new: true })
      .exec();
    
    if (!updatedOffice) {
        throw new NotFoundException('Office not found');
    }

    return updatedOffice;
  }

  async deleteById(id: string): Promise<Office> {
    if (!mongoose.isValidObjectId(id)) {
        throw new BadRequestException('Invalid office ID');
    }
    
    const deletedOffice = await this.officeModel.findByIdAndDelete(id);
    
    if (!deletedOffice) {
        throw new NotFoundException('Office not found');
    }

    return deletedOffice;
  }
}