import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PaymentController } from './controllers/controller';
import { PaymentService } from './services/service';
import { Payment, PaymentSchema } from './schema';
import { AuthModule } from '../auth/module';
import { CredentialsModule } from '../credentials/module';

@Module({
    imports: [ 
        AuthModule,
        CredentialsModule,
        MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]) 
    ],
    controllers: [PaymentController],
    providers: [PaymentService],
})

export class PaymentModule {}