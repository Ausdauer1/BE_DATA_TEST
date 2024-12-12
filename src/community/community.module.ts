import { Module } from '@nestjs/common';
import { CommunityController } from './community.controller';
import { CommunityService } from './community.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { POST } from './entity/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([POST])],
  controllers: [CommunityController],
  providers: [CommunityService]
})
export class CommunityModule {}
