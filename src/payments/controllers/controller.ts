import { Controller, Post, Body, ValidationPipe, Get, Param, Req, Put, Delete, UseGuards, UnauthorizedException } from '@nestjs/common';
import { Payment } from '../schema';
import { PaymentService } from '../services/service';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { UpdatePaymentDto } from '../dto/update-payment.dto';
import { CredentialsService } from '../../credentials/services/service';
import { RolesAuthGuard } from '../../auth/roles-auth.guard';
import { UserType } from '../../common/enums/user.enum';
import { Roles } from '../../auth/roles.decorator';

@Controller('payments')
@UseGuards(RolesAuthGuard)
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly credentialsService: CredentialsService
  ) {}

  //Create payment for a renter
  @Post()
  @Roles(UserType.Renter)
  async createPayment(@Body
    (new ValidationPipe()) createPaymentDto: CreatePaymentDto,
    @Req() req
    ): Promise<Payment> {
      
    const user = req.user;
    const credentials = await this.credentialsService.findId(user);
    return this.paymentService.create(createPaymentDto, user, credentials);
  }

  //Get all payments for a renter
  @Get()
  @Roles(UserType.Renter)
  async getAllPayments(@Req() req): Promise<Payment[]> {
    return this.paymentService.findAll(req.user);
  }

  //Get specific payment for a renter
  @Get(':id')
  @Roles(UserType.Renter)
  async getPaymentById(@Param('id') id: string, @Req() req): Promise<Payment> {

    const user = req.user;
    const payment = await this.paymentService.findById(id);

    if (payment.user.id != user.id){
      throw new UnauthorizedException('You are not authorized to view this payment.');
    }

    return this.paymentService.findById(id);
  }

  // @Put(':id')
  // async updatePayment(
  //   @Param('id') id: string,
  //   @Body(new ValidationPipe()) updateUserDto: UpdatePaymentDto
  // ): Promise<Payment> {
  //   return this.paymentService.updateById(id, updateUserDto);
  // }

  // @Delete(':id')
  // async deletePayment(@Param('id') id: string): Promise<Payment> {
  //   return this.paymentService.deleteById(id);
  // }
}
