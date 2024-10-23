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

    // async findById(id: string) {
    //     return await this.userRepository.findOne({
    //         where: {
    //             id: id
    //         }
    //     })
    // }

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

    async login(email: string, password: string): Promise<boolean> {
        // 여기에서 실제 사용자 인증 로직을 처리합니다 (DB 조회 또는 하드코딩 예시)
        
        
        const user = await this.userRepository.findOne({
            where: {
                email
            }
        })
        console.log(user)
        if (!user) return false

        if (email === user.email && password === user.password) {
            return true;
        }
    
        return false;
    }

    async login2(id: string, password: string, req): Promise<boolean> {
        // 여기에서 실제 사용자 인증 로직을 처리합니다 (DB 조회 또는 하드코딩 예시)
        const validUser = { id: 'user1', password: 'pass1' }; // 예시 사용자
    
        if (id === validUser.id && password === validUser.password) {
            req.session.user = { username: validUser.id }; // 세션에 사용자 정보 저장
            return true;
        }
    
        return false;
    }
}
