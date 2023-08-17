import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { OfficeController } from './controllers/controller';
import { OfficeService } from './services/service';
import { Office, OfficeSchema } from './schema';

@Module({
    imports: [ MongooseModule.forFeature([{ name: Office.name, schema: OfficeSchema }]) ],
    controllers: [OfficeController],
    providers: [OfficeService],
})

export class OfficeModule {}