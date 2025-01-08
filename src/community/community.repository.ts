import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LIKE } from './entity/like.entity';

@Injectable()
export class CommunityRepo {
  constructor(
    @InjectRepository(LIKE)
    private likeRepository: Repository<LIKE>,
  ) {}

  async deleteLike() {
    
  }

  async addLike() {

  }
}