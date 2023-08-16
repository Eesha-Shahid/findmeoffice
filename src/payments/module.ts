import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PaymentController } from './controllers/controller';
import { PaymentService } from './services/service';
import { Payment, PaymentSchema } from './schema';

@Module({
    imports: [ MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]) ],
    controllers: [PaymentController],
    providers: [PaymentService],
})

export class PaymentModule {}