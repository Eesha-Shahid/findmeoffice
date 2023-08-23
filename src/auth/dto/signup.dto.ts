import { IsString, IsNotEmpty, IsEmail, Length, IsEnum, IsOptional, IsPhoneNumber, Validate, MinLength } from 'class-validator';
import { UserType } from '../../common/enums/user.enum';

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

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
