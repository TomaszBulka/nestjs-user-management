import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/users/user.repository';
import { LoginDto } from './dto/login.dto';
import { JwtPayLoad } from './jwt.payload.interface';
import { JwtService} from '@nestjs/jwt'
import { LoginResponseDto } from './dto/login-response.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService,
    ){}


    async logIn(loginDto: LoginDto): Promise<LoginResponseDto>{
        const username = await this.userRepository.validateUserPassword(loginDto)
        if(!username){
            throw new UnauthorizedException('Invalid credentials')
        }
        const payLoad: JwtPayLoad = { username }
        const accessToken = await this.jwtService.sign(payLoad);

        return { accessToken }
    }
}
