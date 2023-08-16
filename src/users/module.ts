import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserController } from './controllers/controller';
import { UserService } from './services/service';
import { User, UserSchema } from './schema';

@Module({
    imports: [ MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]) ],
    controllers: [UserController],
    providers: [UserService],
})

export class UserModule {}