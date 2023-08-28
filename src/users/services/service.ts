import mongoose, { Model } from 'mongoose';
import { BadRequestException, ConflictException, Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schema';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) 
    private userModel: Model<User>
    ) {}
    
  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findById(userID: string): Promise<User> {
    if (!mongoose.isValidObjectId(userID)) {
      throw new BadRequestException('Invalid user ID');
    }

    const user = await this.userModel.findById(userID);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return user;
  }

  async findByCustomerId(customerId: string): Promise<User> {
    const user = await this.userModel.findOne({ stripeCustomerId: customerId });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return user;
  }
  
  async updateById(userID: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    if (!mongoose.isValidObjectId(userID)) {
      throw new BadRequestException('Invalid user ID');
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(userID, updateUserDto, { new: true })
      .exec();
    
    if (!updatedUser) {
        throw new NotFoundException('User not found');
    }

    return updatedUser;
  }

  async deleteById(userID: string): Promise<User> {
    if (!mongoose.isValidObjectId(userID)) {
        throw new BadRequestException('Invalid user ID');
    }
    
    const deletedUser = await this.userModel.findByIdAndDelete(userID);
    
    if (!deletedUser) {
        throw new NotFoundException('User not found');
    }

    return deletedUser;
  }
}