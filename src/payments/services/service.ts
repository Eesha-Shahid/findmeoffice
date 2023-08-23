import mongoose, { Model } from 'mongoose';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Payment } from '../schema';
import  { CreatePaymentDto } from '../dto/create-payment.dto';
import { UpdatePaymentDto } from '../dto/update-payment.dto';
import { Credentials } from '../../credentials/schema';
import { User } from '../../users/schema';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment.name) 
    private paymentModel: Model<Payment>
    ) {}

  async create(
    createPaymentDto: CreatePaymentDto,
    user: User,
    credentials: Credentials
    ): Promise<Payment> {
      
    const data = Object.assign(createPaymentDto, { user: user._id, credentials: credentials._id })
    return this.paymentModel.create(data);
  }

  async findAll(userId: string): Promise<Payment[]> {
    return this.paymentModel.find({ user: userId }).exec();
  }

  async findById(id: string): Promise<Payment> {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Invalid payment ID');
    }

    const payment = await this.paymentModel.findById(id);

    if (!payment) {
      throw new NotFoundException('Payment not found.');
    }

    return payment;
  }
  
  async updateById(id: string, updatePaymentDto: UpdatePaymentDto): Promise<Payment | null> {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Invalid payment ID');
    }

    const updatedPayment = await this.paymentModel
      .findByIdAndUpdate(id, updatePaymentDto, { new: true })
      .exec();
    
    if (!updatedPayment) {
        throw new NotFoundException('Payment not found');
    }

    return updatedPayment;
  }

  async deleteById(id: string): Promise<Payment> {
    if (!mongoose.isValidObjectId(id)) {
        throw new BadRequestException('Invalid payment ID');
    }
    
    const deletedPayment = await this.paymentModel.findByIdAndDelete(id);
    
    if (!deletedPayment) {
        throw new NotFoundException('Payment not found');
    }

    return deletedPayment;
  }
}