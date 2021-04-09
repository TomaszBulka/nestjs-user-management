import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiExtraModels, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@ApiExtraModels(LoginResponseDto)
@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
    ){}
    
    @ApiBody({ type: LoginDto})
    @ApiCreatedResponse({type: LoginResponseDto})
    @ApiUnauthorizedResponse({ description: 'Unauthorized'})
    @Post()
    login(@Body(ValidationPipe) loginDto: LoginDto): Promise<LoginResponseDto>{
        return this.authService.logIn(loginDto)
    }
}
