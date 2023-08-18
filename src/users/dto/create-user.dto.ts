import { IsString, IsNotEmpty, IsEmail, Length, IsEnum, IsOptional, IsPhoneNumber, Validate } from 'class-validator';
import { UserType } from '../../common/enums/user.enum';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Length(11)
  @IsNotEmpty()
  @IsPhoneNumber('PK')
  phoneNumber: string;

  @IsOptional()
  @IsString()
  profilePic?: string;

  @IsEnum(UserType)
  @IsNotEmpty()
  userType: UserType;
}
