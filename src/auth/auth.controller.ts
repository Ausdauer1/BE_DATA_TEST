import { Controller, ConflictException, Body, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/authDto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
   
    @Post('/signup')
    async signUp(@Body() authDto: AuthDto.SignUp,  @Res() res: any) {
        console.log(authDto)
        const { email, nickname } = authDto

        // const existId = await this.authService.findById(id)
        // if (existId) {
        //     throw new ConflictException('이미 사용중인 아이디 입니다')
        // }

        // const existNickName = await this.authService.findByNickname(nickname)
        // if (existNickName) {
        //     throw new ConflictException('이미 사용중인 닉네임 입니다')
        // }

        // const existNickEmail = await this.authService.findByEmail(email)
        // if (existNickEmail) {
        //     throw new ConflictException('이미 사용중인 이메일 입니다')
        // }
        if (!authDto.type) authDto.type = "email"
        const create = await this.authService.create(authDto);
        create["signup"] = "ok"
        delete create["password"]
        console.log(create)
        return res.status(200).json(create);
    }

    @Post('/signup/social')
    async signUpSoical(@Body() authDto: AuthDto.signUpSocial,  @Res() res: any) {
        console.log(authDto)
        const { email, nickname } = authDto
        // 타입이 안들어올경우 타입
        if (!authDto.type) authDto.type = "social"
        const create = await this.authService.create(authDto);
        create["signup"] = "ok"
        console.log(create)
        return res.status(200).json(create);
    }

    @Post('/signin')
    async signIn(@Body() authDto: AuthDto.SignIn, @Req() req: any, @Res() res: any) {
        const { email, password } = authDto
        console.log(password)
        const result = await this.authService.login(email, password, req);
        if (result) {
        return res.status(200).json({
            id: result.id,
            nickname: result.nickname,
            email: result.email, 
            sid: result.sid,
            message: 'Login successful' 
        });
        } else {
        return res.status(401).json({ message: 'Invalid credentials' });
        }
    }

    @Post('/signin/social')
    async signInSocial(@Body() authDto: AuthDto.SignIn, @Req() req: any, @Res() res: any) {
        const { email, password } = authDto
        const result = await this.authService.login(email, password, req);
        if (result) {
        return res.status(200).json({ message: 'Login successful' });
        } else {
        return res.status(401).json({ message: 'Invalid credentials' });
        }
    }

    @Post('/signin2')
    async signIn2(@Body() authDto: AuthDto.SignIn, @Req() req: any, @Res() res: any) {
        const { email, password } = authDto
        const result = await this.authService.login2(email, password, req);
        if (result) {
        return res.status(200).json({ message: 'Login successful' });
        } else {
        return res.status(401).json({ message: 'Invalid credentials' });
        }
    }
    
}

