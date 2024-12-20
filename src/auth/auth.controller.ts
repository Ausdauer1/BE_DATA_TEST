import { Controller, Body, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpEmailDto } from './dto/signUpEmail.dto';
import { SignUpSocialDto } from './dto/signUpSocial.dto'; 
import { SignInDto } from './dto/signIn.dto'; 
import { CheckEmailDto } from './dto/checkEmail.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('유저관련 API')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/check')
  @ApiOperation({ summary: '가입 이메일 중복확인 API' })
  async emailCheck(@Body() checkEmailDto: CheckEmailDto) {
    return await this.authService.emailCheck(checkEmailDto);
  }

  @Post('/signup')
  @ApiOperation({ summary: '일반 회원가입 API' })
  async signUp(@Body() signupEmailDto: SignUpEmailDto) {
    return await this.authService.signUp(signupEmailDto);
  }

  @Post('/signup/social')
  @ApiOperation({ summary: '소셜 회원가입 API' })
  async signUpSocial(@Body() signUpSocialDto: SignUpSocialDto) {
    return await this.authService.signUpSocial(signUpSocialDto);
  }

  @Post('/signin')
  @ApiOperation({ summary: '로그인 API' })
  async signIn(@Body() signInDto: SignInDto, @Req() req: any) {
    return await this.authService.signIn(signInDto, req);
  }
}
