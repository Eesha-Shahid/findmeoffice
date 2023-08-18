import { Controller, Post, Body, ValidationPipe, Get, Param, NotFoundException, Put, Delete } from '@nestjs/common';
import { PaymentService } from '../services/service';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { Payment } from '../schema';
import { UpdatePaymentDto } from '../dto/update-payment.dto';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  async createPayment(@Body(new ValidationPipe()) createPaymentDto: CreatePaymentDto): Promise<Payment> {
    return this.paymentService.create(createPaymentDto);
  }

  @Get()
  async getAllPayments(): Promise<Payment[]> {
    return this.paymentService.findAll();
  }

  @Get(':id')
  async getPaymentById(@Param('id') id: string): Promise<Payment> {
    return this.paymentService.findById(id);
  }

  @Put(':id')
  async updatePayment(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateUserDto: UpdatePaymentDto
  ): Promise<Payment> {
    return this.paymentService.updateById(id, updateUserDto);
  }

  @Delete(':id')
  async deletePayment(@Param('id') id: string): Promise<Payment> {
    return this.paymentService.deleteById(id);
  }
}
