import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { USER } from 'src/entity/user.entity';
import { AuthDto } from './dto/authDto';


@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(USER)
        private userRepository: Repository<USER>,
    ) {}

    async create(authDto: AuthDto.SignUp) {
        console.log(authDto)
        const userEntity = this.userRepository.create(authDto)
        console.log(userEntity)
        await this.userRepository.save(userEntity)
    }

    async findById(id: string) {
        return await this.userRepository.findOne({
            where: {
                id: id
            }
        })
    }

    async findByEmail(email: string) {
        return await this.userRepository.findOne({
            where: {
                email
            }
        })
    }

    async findByNickname(nickname: string) {
        return await this.userRepository.findOne({
            where: {
                nickname
            }
        })
    }
}
