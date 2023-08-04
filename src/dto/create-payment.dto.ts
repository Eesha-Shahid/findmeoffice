import { IsNotEmpty, IsNumber, IsEnum, IsMongoId, IsOptional } from 'class-validator';
import { Decimal128 } from 'mongoose';
import { PaymentMethod } from 'src/common/enums/payment.enum';

export class CreatePaymentDto {
    @IsNotEmpty()
    @IsMongoId()
    user: string;

    @IsNotEmpty()
    @IsMongoId()
    credentials: string;

    @IsNotEmpty()
    @IsNumber()
    amount: Decimal128;

    @IsNotEmpty()
    @IsEnum(PaymentMethod)
    method: PaymentMethod;
}
