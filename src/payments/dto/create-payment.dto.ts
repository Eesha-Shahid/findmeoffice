import { IsString, IsNotEmpty, IsNumber, IsEmpty } from 'class-validator';
import { Office } from '../../offices/schema';
import { User } from '../../users/schema';
 
export class CreatePaymentDto {

  @IsEmpty()
  user: string;

  @IsNotEmpty()
  office: string;

  @IsEmpty()
  // @IsNumber()
  amount: number;

  @IsEmpty()
  paymentMethod: string;
}