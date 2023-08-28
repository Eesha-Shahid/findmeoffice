import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { PassportModule } from "@nestjs/passport";
import { User, UserSchema } from "src/users/schema";
import { AuthController } from "./controllers/controller";
import { AuthService } from "./services/service";
import { JwtStrategy } from "./jwt.strategy";
import { StripeModule } from "src/payments/module";

@Module({
    imports: [ 
        PassportModule.register({ defaultStrategy: 'jwt'}),
        JwtModule.registerAsync({
            useFactory: () => ({
                secret: process.env.JWT_SECRET,
                signOptions: {
                    expiresIn: process.env.JWT_EXPIRES,
                },
            }),
        }),        
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]) ,
        StripeModule
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    exports: [JwtStrategy, PassportModule]
})

export class AuthModule {}