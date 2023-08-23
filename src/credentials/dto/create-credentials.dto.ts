import { IsCreditCard, IsDateString, IsEmpty, IsNotEmpty, IsString } from 'class-validator';
import { User } from '../../users/schema';

export class CreateCredentialsDto {
    
    @IsEmpty({ message: 'You cannot pass user id' })
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
