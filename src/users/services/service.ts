import mongoose, { Model } from 'mongoose';
import { BadRequestException, ConflictException, Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schema';
import  { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) 
    private userModel: Model<User>
    ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = await this.userModel.create(createUserDto).catch(error => {
      if (error.code === 11000) {
        throw new ConflictException('User with this email already exists.');
      }
      throw error;
    });
    return createdUser;
  }
    
  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findById(id: string): Promise<User> {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Invalid user ID');
    }

    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return user;
  }
  
  async updateById(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Invalid user ID');
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
    
    if (!updatedUser) {
        throw new NotFoundException('User not found');
    }

    return updatedUser;
  }

  async deleteById(id: string): Promise<User> {
    if (!mongoose.isValidObjectId(id)) {
        throw new BadRequestException('Invalid user ID');
    }
    
    const deletedUser = await this.userModel.findByIdAndDelete(id);
    
    if (!deletedUser) {
        throw new NotFoundException('User not found');
    }

    return deletedUser;
  }
}