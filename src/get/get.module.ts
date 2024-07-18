import { Module } from '@nestjs/common';
import { GetController } from './get.controller';
import { GetService } from './get.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PLAYER_INFO } from 'src/entity/playerInfo.entity';
import { YEAR_RECORD_BATTER } from 'src/entity/yearRecordBatter.entity';
import { YEAR_RECORD_PITCHER } from 'src/entity/yearRecordPitcher.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PLAYER_INFO, YEAR_RECORD_BATTER, YEAR_RECORD_PITCHER])],
  controllers: [GetController],
  providers: [GetService],
  exports: [GetModule, TypeOrmModule]
})
export class GetModule {}
