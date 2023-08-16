import { IsNotEmpty, IsNumber, IsEnum, IsMongoId, IsOptional } from 'class-validator';
import { Decimal128 } from 'mongoose';
import { PaymentMethod } from '../../common/enums/payment.enum';
import { Credentials } from '../../credentials/schema';
import { User } from '../../users/schema';

export class CreatePaymentDto {
    @IsNotEmpty()
    @IsMongoId()
    user: User;

    @IsNotEmpty()
    @IsMongoId()
    credentials: Credentials;

    @IsNotEmpty()
    @IsNumber()
    amount: Decimal128;

    @IsNotEmpty()
    @IsEnum(PaymentMethod)
    method: PaymentMethod;
}
