import { IsString, IsNotEmpty, IsOptional, IsMongoId, IsEmpty } from 'class-validator';
import { User } from '../../users/schema';

export class CreateFeedbackDto {
  
  @IsEmpty({ message: 'You cannot pass user id' })
  user: User; 

  @IsString()
  @IsOptional()
  subject?: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}
