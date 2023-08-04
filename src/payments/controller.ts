import { Controller, Post, Body, ValidationPipe, Get, Param, NotFoundException } from '@nestjs/common';
import { PaymentService } from './service';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { Payment } from './schema';

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
    const payment = await this.paymentService.findById(id);
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }
    return payment;
  }
}
