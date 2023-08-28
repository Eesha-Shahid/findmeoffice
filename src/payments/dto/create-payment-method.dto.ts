import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePaymentMethodDto {
  @IsString()
  @IsNotEmpty()
  cardNumber: string;

  @IsNumber()
  @IsNotEmpty()
  expMonth: number;

  @IsNumber()
  @IsNotEmpty()
  expYear: number;

  @IsString()
  @IsNotEmpty()
  cvc: string;
}
