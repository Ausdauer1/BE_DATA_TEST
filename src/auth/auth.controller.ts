import { Controller, Body, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpEmailDto } from './dto/signUpEmail.dto';
import { SignUpSocialDto } from './dto/signUpSocial.dto'; 
import { SignInDto } from './dto/signIn.dto'; 
import { CheckEmailDto } from './dto/emailCheck.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/check')
  async emailCheck(@Body() authDto: CheckEmailDto) {
    return await this.authService.emailCheck(authDto.email);
  }

  @Post('/signup')
  async signUp(@Body() signupEmailDto: SignUpEmailDto) {
    return await this.authService.signUp(signupEmailDto);
  }

  @Post('/signup/social')
  async signUpSocial(@Body() signUpSocialDto: SignUpSocialDto) {
    return await this.authService.signUpSocial(signUpSocialDto);
  }

  @Post('/signin')
  async signIn(@Body() signInDto: SignInDto, @Req() req: any) {
    return await this.authService.signIn(signInDto, req);
  }
}
