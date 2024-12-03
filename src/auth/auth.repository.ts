import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { USER } from 'src/auth/entity/user.entity';

@Injectable()
export class AuthRepo {
  constructor(
    @InjectRepository(USER)
    private userRepository: Repository<USER>,
  ) {}

  async findByEmail(email: string) {
    return await this.userRepository.findOne({
      where: {
        email,
      },
    });
  }

  async findByNickname(nickname: string) {
    return await this.userRepository.findOne({
      where: {
        nickname,
      },
    });
  }
}
