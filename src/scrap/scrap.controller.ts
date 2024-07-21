import { Controller, Get, Param, Query } from '@nestjs/common';
import { ScrapService } from './scrap.service';
import { ScrapTotalRecentService } from './scrapTotalRecent.service';
import { get } from 'http';

@Controller('scraping')
export class ScrapController {
  constructor(
    private readonly scrapingService: ScrapService,
    private readonly scrapTotalRecentService: ScrapTotalRecentService,
  ) {}

  // /scraping/players 엔드포인트에서 GET 요청을 처리합니다.
  @Get('players')
  async getPlayers(@Query('team') team: string) {
    // ScrapingService를 사용하여 주어진 URL에서 선수 정보를 스크래핑합니다.
    return this.scrapingService.scrapeBaseballPlayers(team);
  }

  @Get('recordB')
  async recordB() {
    return this.scrapingService.scrapPlayersRecords()
  }

  @Get('recordP/:year')
  async recordP(@Param('year') year: string) {
    return this.scrapingService.scrapPitcherRecordsThisYear(year)
  }

  @Get('record/years')
  async recordYears() {
    return this.scrapTotalRecentService.scrapTotalRecords()
  }
  
  @Get('career')
  async careerRecords() {
    return this.scrapTotalRecentService.careerRecord()
  }
}