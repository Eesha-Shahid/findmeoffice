import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from '../../users/schema';
import { Model } from "mongoose";
import * as bcrypt from 'bcryptjs';
import { JwtService } from "@nestjs/jwt";
import { SignUpDto } from "../dto/signup.dto";
import { LoginDto } from "../dto/login.dto";
import StripeService from "src/payments/services/service";

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>,
        private jwtService: JwtService,
        private stripeService: StripeService
    ){}

    async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
        try {
            const hashedPassword = await bcrypt.hash(signUpDto.password, 10);
            const stripeCustomer = await this.stripeService.createCustomer(signUpDto.name, signUpDto.email);
            const createdUser = await this.userModel.create({
                ...signUpDto,
                stripeCustomerId: stripeCustomer.id,
                password: hashedPassword,
            });
    
            const token = this.jwtService.sign({ id: createdUser._id });
            return { token };

        } catch (error) {

            if (error.code === 11000) {
                throw new ConflictException('User with this email already exists.');
            }
            throw new Error('User registration failed.');
        }
    }    

    async login(loginDto: LoginDto): Promise<{ token: string }> {
        const { email, password } = loginDto;
    
        const user = await this.userModel.findOne({ email });
   
        //user.password = hashed password
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException('Invalid email or password');
        }
    
        const token = this.jwtService.sign({ id: user._id });
        return { token };
    } 
}