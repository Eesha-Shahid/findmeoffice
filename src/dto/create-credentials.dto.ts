import { IsCreditCard, IsDateString, IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateCredentialsDto {
    @IsNotEmpty()
    @IsMongoId()
    user: string;
    
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
