import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy} from '@nestjs/passport'
import { InjectRepository } from '@nestjs/typeorm'
import {Strategy, ExtractJwt} from 'passport-jwt'
import { JwtPayLoad } from './jwt.payload.interface'
import { UserRepository } from '../users/user.repository'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'mySecret',

        })
    }

    async validate(payLoad: JwtPayLoad){
        const {username} = payLoad;
        const user = await this.userRepository.findOne({username});

        if(!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}
