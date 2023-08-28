import { IsNotEmpty, IsNumber, IsString, IsArray, IsEnum, IsOptional, ArrayMinSize, IsMongoId, IsLatitude, IsLongitude, IsEmpty, isNotEmpty } from 'class-validator';
import { OfficeType, RentalStatus } from '../../common/enums/office.enum';
import { Decimal128 } from 'mongoose';
import { User } from '../../users/schema';

export class CreateOfficeDto {
    @IsNotEmpty()
    @IsString()
    buildingName: string;

    @IsNotEmpty()
    @IsNumber()
    buildingSize: Decimal128;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNotEmpty()
    @IsNumber()
    monthlyRate: number;

    @IsNotEmpty()
    @IsArray()
    @ArrayMinSize(3)
    @IsString({ each: true })
    image: string[];

    @IsNotEmpty()
    @IsString()
    address: string;

    @IsNotEmpty()
    @IsNumber()
    @IsLatitude()	
    latitude: Decimal128;

    @IsNotEmpty()
    @IsNumber()
    @IsLongitude()	
    longitude: Decimal128;

    @IsOptional()
    @IsNotEmpty()
    @IsEnum(RentalStatus)
    rentalStatus: RentalStatus;

    @IsArray()
    @ArrayMinSize(1)
    @IsEnum(OfficeType, {
      each: true,
      message: `each value in officeType must be one of the following values: ${Object.values(OfficeType).join(', ')}`,
    })
    officeType: OfficeType[];

    @IsEmpty({ message: 'You cannot pass user id' })
    owner: User;

    @IsEmpty({ message: 'You cannot pass user id' })
    renter?: string;
}
