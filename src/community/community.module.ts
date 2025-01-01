import { Module } from '@nestjs/common';
import { CommunityController } from './community.controller';
import { CommunityService } from './community.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { POST } from './entity/post.entity';
import { LIKE } from './entity/like.entity';

@Module({
  imports: [TypeOrmModule.forFeature([POST, LIKE])],
  controllers: [CommunityController],
  providers: [CommunityService]
})
export class CommunityModule {}
