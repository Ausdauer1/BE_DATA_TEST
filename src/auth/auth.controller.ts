import { Controller, ConflictException, Body, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/authDto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
   
    @Post('/signup')
    async signUp(@Body() authDto: AuthDto.SignUp) {
        console.log(authDto)
        const { id, email, nickname } = authDto

        const existId = await this.authService.findById(id)
        if (existId) {
            throw new ConflictException('이미 사용중인 아이디 입니다')
        }

        const existNickName = await this.authService.findByNickname(nickname)
        if (existNickName) {
            throw new ConflictException('이미 사용중인 닉네임 입니다')
        }

        const existNickEmail = await this.authService.findByNickname(email)
        if (existNickEmail) {
            throw new ConflictException(401)
        }

        await this.authService.create(authDto);
        return '회원가입성공'; 
    }
    
}

