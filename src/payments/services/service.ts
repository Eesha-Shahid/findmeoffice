import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { OfficeService } from "../../offices/services/service";
import Stripe from 'stripe';
import { InjectModel } from '@nestjs/mongoose';
import { Payment } from '../schema';
import { Model, Types } from 'mongoose';
import { RentalStatus } from 'src/common/enums/office.enum';

 
@Injectable()
export default class StripeService {
  private stripe: Stripe;
 
  constructor(

    @Inject(forwardRef(() => OfficeService)) 
    private readonly officeService: OfficeService,

    @InjectModel(Payment.name) 
    private paymentModel: Model<Payment>

  ){

    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, 
      {apiVersion: '2023-08-16',
    });

  }

  //Creates a Stripe Customer 
  async createCustomer(name: string, email: string) {
    return this.stripe.customers.create({
      name,
      email
    });
  }

  //Step: 1 Create payment intent, returns payment intent
  async createPaymentIntent(userID: string, customerId: string, officeID: string){

    const office = await this.officeService.findById(officeID)
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: office.monthlyRate,
      currency: process.env.STRIPE_CURRENCY,
      customer: customerId,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
      payment_method: "pm_card_visa"
    });

    //Updating rental status and renter
    await this.officeService.updateById(officeID, { rentalStatus: RentalStatus.Rented, renter: userID })

    //Storing in database
    const paymentDocument = {
      amount: paymentIntent.amount,
      paymentMethod: paymentIntent.payment_method_types.toString()
    };

    const data = Object.assign(paymentDocument, { user: userID, office: officeID })
    await this.paymentModel.create(data)
    return paymentIntent;
  }

  //Step: 2 Create payment method using card details, returns payment method object
  async createPaymentMethod(cardNumber: string, expMonth: number, expYear: number, cvc: string) {
    return this.stripe.paymentMethods.create({
      type: 'card',
      card: {
        number: cardNumber,
        exp_month: expMonth,
        exp_year: expYear,
        cvc,
      },
    });
  }

  //Step: 3 Accepts client secret and payment method id to confirm card payment
  async confirmCardPayment(clientSecret: string, paymentMethodId: string) {
    const paymentIntent = await this.stripe.paymentIntents.confirm(clientSecret, {
      payment_method: "pm_card_visa",
    });
    return paymentIntent;
  }
}