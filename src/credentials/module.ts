import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CredentialsController } from './controllers/controller';
import { CredentialsService } from './services/service';
import { Credentials, CredentialsSchema } from './schema';
import { AuthModule } from '../auth/module';

@Module({
    imports: [ 
        AuthModule,
        MongooseModule.forFeature([{ name: Credentials.name, schema: CredentialsSchema }]) 
    ],
    controllers: [CredentialsController],
    providers: [CredentialsService],
    exports: [CredentialsService]
})

export class CredentialsModule {}