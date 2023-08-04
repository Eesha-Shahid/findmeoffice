import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PaymentController } from './controller';
import { PaymentService } from './service';
import { Payment, PaymentSchema } from './schema';

@Module({
    imports: [ MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]) ],
    controllers: [PaymentController],
    providers: [PaymentService],
})

export class PaymentModule {}