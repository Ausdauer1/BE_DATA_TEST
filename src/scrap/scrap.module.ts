import { Module } from '@nestjs/common';
import { ScrapService } from './scrap.service';
import { ScrapController } from './scrap.controller';
import { PLAYER_INFO } from './entity/playerInfo.entity'
import { TypeOrmModule } from '@nestjs/typeorm';
import { YEAR_RECORD_BATTER } from './entity/yearRecordBatter.entity';


@Module({
  imports: [TypeOrmModule.forFeature([PLAYER_INFO, YEAR_RECORD_BATTER])],
  // ScrapingService를 모듈에 등록합니다.
  providers: [ScrapService],
  // ScrapingController를 모듈에 등록합니다.
  controllers: [ScrapController],
  // ScrapingService를 외부 모듈에서도 사용할 수 있도록 내보냅니다.
  exports: [ScrapService, TypeOrmModule],
})
export class ScrapModule {}
