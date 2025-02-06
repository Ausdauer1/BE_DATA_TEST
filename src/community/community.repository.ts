import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LIKE } from './entity/like.entity';
import { LikeDto } from './dto/like.dto';
import { COMMENT_LIKE } from './entity/commentLike.entity';

@Injectable()
export class CommunityRepo {
  constructor(
    @InjectRepository(LIKE)
    private likeRepository: Repository<LIKE>,
    @InjectRepository(COMMENT_LIKE)
    private commentLikeRepository: Repository<COMMENT_LIKE>,
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

  async deleteCommentLike(userId: number, commentId: number) {
    const result = await this.commentLikeRepository.delete({
      user_id: userId,
      comment_id: commentId
    })

    if (result.affected && result.affected > 0) {
      return { result: 'success' }
    } else {
      return { result: 'fail' }
    }
  }

}