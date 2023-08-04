import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import config from './config/config';

import { UserModule } from './users/module';
import { OfficeModule } from './offices/module';
import { FeedbackModule } from './feedbacks/module';
import { NotificationModule } from './notifications/module';
import { PaymentModule } from './payments/module';
import { CredentialsModule } from './credentials/module';

@Module({
  imports: [ 
    MongooseModule.forRoot(config.mongoURI, { dbName: 'fmo_db',}),
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
