import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateFeedbackDto {
  @IsString()
  @IsOptional()
  subject?: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}
