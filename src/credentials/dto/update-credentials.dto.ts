import { PartialType } from '@nestjs/mapped-types';
import { CreateCredentialsDto } from './create-credentials.dto';

export class UpdateCredentialsDto extends PartialType(CreateCredentialsDto) {}

