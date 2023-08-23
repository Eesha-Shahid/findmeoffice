import { IsNotEmpty, IsNumber, IsEnum, IsMongoId, IsEmpty } from 'class-validator';
import { Decimal128 } from 'mongoose';
import { PaymentMethod } from '../../common/enums/payment.enum';
import { Credentials } from '../../credentials/schema';
import { User } from '../../users/schema';

export class CreatePaymentDto {
    
    @IsEmpty({ message: 'You cannot pass user id' })
    user: User;

    @IsEmpty({ message: 'You cannot pass credentials id' })
    credentials: Credentials;

    @IsNotEmpty()
    @IsNumber()
    amount: Decimal128;

    @IsNotEmpty()
    @IsEnum(PaymentMethod)
    method: PaymentMethod;
}
