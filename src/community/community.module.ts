import { Module } from '@nestjs/common';
import { CommunityController } from './community.controller';
import { CommunityService } from './community.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { POST } from './entity/post.entity';
import { LIKE } from './entity/like.entity';
import { AuthRepo } from 'src/auth/auth.repository';
import { AuthModule } from 'src/auth/auth.module';
import { CommunityRepo } from './community.repository';
import { COMMENT } from './entity/comment.entity';
import { COMMENT_LIKE } from './entity/commentLike.entity';

@Module({
  imports: [TypeOrmModule.forFeature([POST, LIKE, COMMENT, COMMENT_LIKE])],
  controllers: [CommunityController],
  providers: [CommunityService, CommunityRepo],
})
export class CommunityModule {}
