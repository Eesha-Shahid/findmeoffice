import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { UserModule } from './users/module';
import { OfficeModule } from './offices/module';
import { FeedbackModule } from './feedbacks/module';
import { NotificationModule } from './notifications/module';
import { AuthModule } from './auth/module';
import { StripeModule } from './payments/module';

@Module({
  imports: [ 
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI, { dbName: 'fmo_db',}),
    AuthModule,
    UserModule,
    OfficeModule,
    FeedbackModule,
    NotificationModule,
    StripeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
