import { IsString, IsNotEmpty, IsOptional, IsMongoId } from 'class-validator';
import { User } from '../../users/schema';

export class CreateFeedbackDto {
  
  @IsNotEmpty()
  @IsMongoId()
  user: User; 

  @IsString()
  @IsOptional()
  subject?: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}
