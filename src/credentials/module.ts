import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CredentialsController } from './controller';
import { CredentialsService } from './service';
import { Credentials, CredentialsSchema } from './schema';

@Module({
    imports: [ MongooseModule.forFeature([{ name: Credentials.name, schema: CredentialsSchema }]) ],
    controllers: [CredentialsController],
    providers: [CredentialsService],
})

export class CredentialsModule {}