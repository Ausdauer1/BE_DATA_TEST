import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthRepo } from './auth.repository';
import { USER } from 'src/auth/entity/user.entity';

import { createClient } from 'redis';
import * as bcrypt from 'bcrypt';


import { SignUpSocialDto } from './dto/signUpSocial.dto';
import { SignUpEmailDto } from './dto/signUpEmail.dto';
import { SignInDto } from './dto/signIn.dto';

@Injectable()
export class AuthService {
  private redisClient = createClient({
    url: 'redis://:dangsan10@13.209.70.240:6379'
  });
  constructor(
    @InjectRepository(USER)
    private userRepository: Repository<USER>,
    private readonly authRepo: AuthRepo
  ) {
    this.redisClient.connect().catch(console.error);
  }
  // 이메일 중복확인
  async emailCheck(email: string) {
    return (await this.authRepo.findByEmail(email)) 
    ? { exist: true } 
    : { exist: false };
  }
  // 회원가입
  async signUp(signupEmailDto: SignUpEmailDto) {
    if (signupEmailDto.type === "email") {
      if (await this.authRepo.findByEmail(signupEmailDto.email)) {
        throw new ConflictException("이미 사용중인 이메일 입니다");
      }
      if (await this.authRepo.findByNickname(signupEmailDto.nickname)) {
        throw new ConflictException("이미 사용중인 닉네임 입니다");
      }
      const userEntity = this.userRepository.create(signupEmailDto);
      // 소셜과 다르게 비밀번호 해쉬
      userEntity.password = await bcrypt.hash(userEntity.password, 10);
      const newObject = await this.userRepository.save(userEntity);
      delete newObject["password"];
      newObject["signup"] = "ok";
      return newObject;
    } else {
      throw new BadRequestException("잘못된 요청입니다");
    }
  }
  // 소셜 회원가입
  async signUpSocial(signUpSocialDto: SignUpSocialDto) {
    if (signUpSocialDto.type === "google") {
      if (await this.authRepo.findByEmail(signUpSocialDto.email)) {
        throw new ConflictException("이미 사용중인 이메일 입니다");
      }
      if (await this.authRepo.findByNickname(signUpSocialDto.nickname)) {
        throw new ConflictException("이미 사용중인 닉네임 입니다");
      }
      const userEntity = this.userRepository.create(signUpSocialDto);
      const newObject = await this.userRepository.save(userEntity);
      delete newObject["password"];
      newObject["signup"] = "ok";
      return newObject;
    } else {
      throw new BadRequestException("잘못된 요청입니다");
    }
  }

  // 로그인
  async signIn(signInDto: SignInDto, req: any): Promise<any> {
    const user = await this.userRepository.findOne({
      where: {
        email: signInDto.email,
      },
    });
    if (!user) throw new NotFoundException("회원정보가 없습니다")
  
    let passMatch: boolean;
    if (user.type === 'email') {
      passMatch = await bcrypt.compare(signInDto.password, user.password);
    }

    if (user.type === 'google' || passMatch) {
      const rediskeyArr = await this.redisClient.keys('*');
      const deleteLoggedInUser = rediskeyArr.map(async (e) => {
        const valueString: string = await this.redisClient.get(`${e}`);
        const valueObject: object = JSON.parse(valueString);
        if (valueObject['user'] === user.email) {
          await this.redisClient.del(`${e}`);
        }
      });
      await Promise.all(deleteLoggedInUser);

      req.session.user = user.email;
      await req.session.save();

      return {
        sid: req.sessionID,
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        message: '로그인 완료',
      };
    } else {
      throw new BadRequestException("입력한 정보가 올바르지 않습니다");
    }
  }
}
