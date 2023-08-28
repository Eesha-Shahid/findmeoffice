import { PartialType } from '@nestjs/mapped-types';
import { SignUpDto } from '../../auth/dto/signup.dto';

export class UpdateUserDto extends PartialType(SignUpDto) {}

