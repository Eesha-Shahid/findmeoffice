import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { UserModule } from './users/module';
import { OfficeModule } from './offices/module';
import { FeedbackModule } from './feedbacks/module';
import { NotificationModule } from './notifications/module';
import { PaymentModule } from './payments/module';
import { CredentialsModule } from './credentials/module';
import { AuthModule } from './auth/module';

@Module({
  imports: [ 
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI, { dbName: 'fmo_db',}),
    AuthModule,
    UserModule,
    OfficeModule,
    FeedbackModule,
    NotificationModule,
    PaymentModule,
    CredentialsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
