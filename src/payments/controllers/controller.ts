import { Body, Controller, Post, Req, UseGuards, ValidationPipe, forwardRef } from "@nestjs/common";
import StripeService from "../services/service";
import { RolesAuthGuard } from "src/auth/roles-auth.guard";
import { Roles } from "src/auth/roles.decorator";
import { UserType } from "src/common/enums/user.enum";
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { CreatePaymentMethodDto } from "../dto/create-payment-method.dto";

@UseGuards(RolesAuthGuard)
@Controller('payments')
export class PaymentController {
    constructor(
        private readonly stripeService: StripeService,
    ) {}

    //Step: 1 Create payment intent, returns client secret field from payment intent
    @Roles(UserType.Renter)
    @Post('charge')
    async createPaymentIntent(
      @Body(new ValidationPipe()) createPaymentDto: CreatePaymentDto, 
      @Req() req) {
      const paymentIntent = await this.stripeService.createPaymentIntent(req.user.id, req.user.stripeCustomerId, createPaymentDto.office);
      return { clientSecret: paymentIntent.id } 
    }

    //Step: 2 Create payment method using card details, returns payment method object
    @Roles(UserType.Renter)
    @Post('create')
    async createPaymentMethod(@Body(new ValidationPipe()) createPaymentMethodDto: CreatePaymentMethodDto) {
      const paymentMethod = await this.stripeService.createPaymentMethod(
        createPaymentMethodDto.cardNumber,
        createPaymentMethodDto.expMonth,
        createPaymentMethodDto.expYear,
        createPaymentMethodDto.cvc
      );
      return { paymentMethod };
    }

    //Step: 3 Accepts client secret and payment method id to confirm card payment
    @Post('confirm')
    async confirmCardPayment(@Body() data: { clientSecret: string, paymentMethodId: string }) {
      const paymentIntent = await this.stripeService.confirmCardPayment(data.clientSecret, data.paymentMethodId);
      return { paymentIntent };
    }
  }
