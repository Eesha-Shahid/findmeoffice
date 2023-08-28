import { Module, forwardRef } from '@nestjs/common';
import StripeService from './services/service';
import { PaymentController } from './controllers/controller';
import { OfficeModule } from '../offices/module';
import { Payment, PaymentSchema } from './schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '..//users/module';

@Module({
    imports: [
        forwardRef(() => OfficeModule),
        MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]),
    ],
    controllers: [PaymentController],
    providers: [StripeService],
    exports: [StripeService],
})
export class StripeModule {}
