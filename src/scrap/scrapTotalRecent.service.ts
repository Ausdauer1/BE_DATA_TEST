import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import { InjectRepository } from '@nestjs/typeorm';
import { PLAYER_INFO } from '../entity/playerInfo.entity';
import { TOTAL_RECORD_BATTER } from 'src/entity/totalRecordBatter.entity';
import { TOTAL_RECORD_PITCHER } from 'src/entity/totalRecordPitcher.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { table } from 'console';

@Injectable()
export class ScrapTotalRecentService {
  constructor(
    @InjectRepository(PLAYER_INFO)
    private playerInfoRepository: Repository<PLAYER_INFO>,

    @InjectRepository(TOTAL_RECORD_BATTER)
    private yearRecordBatterRepository: Repository<TOTAL_RECORD_BATTER>,

    @InjectRepository(TOTAL_RECORD_PITCHER)
    private yearRecordPitcherRepository: Repository<TOTAL_RECORD_PITCHER>

  ){}


}