import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LIKE } from './entity/like.entity';
import { LikeDto } from './dto/like.dto';

@Injectable()
export class CommunityRepo {
  constructor(
    @InjectRepository(LIKE)
    private likeRepository: Repository<LIKE>,
  ) {}

  async deleteLike(userId: number, postId: number) {
    const result = await this.likeRepository.delete({
      user_id: userId,
      post_id: postId
    })

    if (result.affected && result.affected > 0) {
      return { result: 'success' }
    } else {
      return { result: 'fail' }
    }
  }

  async addLike(likeDto: LikeDto) {
    const likeEntity = this.likeRepository.create(likeDto)
    return await this.likeRepository.save(likeEntity)
  }
}