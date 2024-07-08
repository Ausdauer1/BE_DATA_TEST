import { Controller, Get, Query } from '@nestjs/common';
import { ScrapService } from './scrap.service';

@Controller('scraping')
export class ScrapController {
  constructor(private readonly scrapingService: ScrapService) {}

  // /scraping/players 엔드포인트에서 GET 요청을 처리합니다.
  @Get('players')
  async getPlayers(@Query('team') team: string) {
    // ScrapingService를 사용하여 주어진 URL에서 선수 정보를 스크래핑합니다.
    return this.scrapingService.scrapeBaseballPlayers(team);
  }
  
}