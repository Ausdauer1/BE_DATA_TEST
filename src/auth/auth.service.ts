import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { USER } from 'src/entity/user.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(USER)
        private userRepository: Repository<USER>,
    ) {}

    
}
