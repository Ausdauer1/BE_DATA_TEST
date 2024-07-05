import { Module } from '@nestjs/common';
import { ScrapService } from './scrap.service';
import { ScrapController } from './scrap.controller';


@Module({
  // ScrapingService를 모듈에 등록합니다.
  providers: [ScrapService],
  // ScrapingController를 모듈에 등록합니다.
  controllers: [ScrapController],
  // ScrapingService를 외부 모듈에서도 사용할 수 있도록 내보냅니다.
  exports: [ScrapService],
})
export class ScrapModule {}
