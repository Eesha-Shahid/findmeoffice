import { IsCreditCard, IsDateString, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { User } from '../../users/schema';

export class CreateCredentialsDto {
    @IsNotEmpty()
    @IsMongoId()
    user: User;
    
    @IsNotEmpty()
    @IsString()
    @IsCreditCard()
    cardNumber: string;

    @IsNotEmpty()
    @IsString()
    cardholderName: string;

    @IsNotEmpty()
    @IsDateString()
    expiryDate: string;

    @IsNotEmpty()
    @IsString()
    securityCode: string;
}
