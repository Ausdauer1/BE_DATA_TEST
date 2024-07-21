import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import { InjectRepository } from '@nestjs/typeorm';
import { PLAYER_INFO } from '../entity/playerInfo.entity';
import { TOTAL_RECORD_BATTER } from 'src/entity/totalRecordBatter.entity';
import { TOTAL_RECORD_PITCHER } from 'src/entity/totalRecordPitcher.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { YEAR_RECORD_BATTER } from 'src/entity/yearRecordBatter.entity';

@Injectable()
export class ScrapTotalRecentService {
  constructor(
    @InjectRepository(PLAYER_INFO)
    private playerInfoRepository: Repository<PLAYER_INFO>,

    @InjectRepository(YEAR_RECORD_BATTER)
    private yearRecordBatterRepository: Repository<YEAR_RECORD_BATTER>,

    @InjectRepository(TOTAL_RECORD_BATTER)
    private totalRecordBatterRepository: Repository<TOTAL_RECORD_BATTER>,

    @InjectRepository(TOTAL_RECORD_PITCHER)
    private totalRecordPitcherRepository: Repository<TOTAL_RECORD_PITCHER>

  ){}

  async scrapTotalRecords() {
    
    const players: PLAYER_INFO[] = await this.playerInfoRepository.createQueryBuilder('playerInfo')
      .select(['playerInfo.kbo_id', 'playerInfo.name', 'playerInfo.team', 'playerInfo.birth_date', 'playerInfo.statiz_id', 'playerInfo.id'])
      .where('playerInfo.statiz_id IS NOT NULL')
      .andWhere('playerInfo.position = "B"')
      // .andWhere('playerInfo.name ="김태군"')
      .getMany();

    const browser = await puppeteer.launch({headless: false, protocolTimeout: 900000});
    const page = await browser.newPage();
    
    
    for (let player of players) {
      await page.goto(`https://statiz.sporki.com/player/?m=year&p_no=${player.statiz_id}`, { waitUntil: 'domcontentloaded', timeout: 10000 });
      await page.waitForSelector('table')
      
      let content = await page.content();
      let $ = cheerio.load(content);
      
      const years: number = $('.table_type02 table tbody:nth-child(2):nth-child(2) tr').length
      for (let i=1; i<=years; i++) {

        const year = $(`.table_type02 table tbody:nth-child(2) tr:nth-child(${i}) td:nth-child(1)`).text().trim()
        
        if (year !== '2024'){
          let j = 1; let k = 1
          if (Number(year)) { j = j+1; k = k+1 }
           
          const record = new TOTAL_RECORD_BATTER();
          console.log(player.name, year)
          record.Pid = player.id
          record.name = player.name
          record.kbo_id_batter = player.kbo_id
          record.statiz_id_batter = player.statiz_id
          record.team = $(`.table_type02 table tbody:nth-child(2) tr:nth-child(${i}) td:nth-child(${k})`).text().trim() 
          record.year = j === 2 ? year : $(`.table_type02 table tbody:nth-child(2) tr:nth-child(${i-1}) td:nth-child(1)`).text().trim()
          record.age = Number($(`.table_type02 table tbody:nth-child(2) tr:nth-child(${i}) td:nth-child(${j+1})`).text())
          record.oWAR = Number($(`.table_type02 table tbody:nth-child(2) tr:nth-child(${i}) td:nth-child(${j+3})`).text())
          record.dWAR = Number($(`.table_type02 table tbody:nth-child(2) tr:nth-child(${i}) td:nth-child(${j+4})`).text())
          record.G = Number($(`.table_type02 table tbody:nth-child(2) tr:nth-child(${i}) td:nth-child(${j+5})`).text())
          record.PA = Number($(`.table_type02 table tbody:nth-child(2) tr:nth-child(${i}) td:nth-child(${j+6})`).text())
          record.ePA = Number($(`.table_type02 table tbody:nth-child(2) tr:nth-child(${i}) td:nth-child(${j+7})`).text())
          record.AB = Number($(`.table_type02 table tbody:nth-child(2) tr:nth-child(${i}) td:nth-child(${j+8})`).text())
          record.R = Number($(`.table_type02 table tbody:nth-child(2) tr:nth-child(${i}) td:nth-child(${j+9})`).text())
          record.H = Number($(`.table_type02 table tbody:nth-child(2) tr:nth-child(${i}) td:nth-child(${j+10})`).text())
          record['2B'] = Number($(`.table_type02 table tbody:nth-child(2) tr:nth-child(${i}) td:nth-child(${j+11})`).text())
          record['3B'] = Number($(`.table_type02 table tbody:nth-child(2) tr:nth-child(${i}) td:nth-child(${j+12})`).text())
          record.HR = Number($(`.table_type02 table tbody:nth-child(2) tr:nth-child(${i}) td:nth-child(${j+13})`).text())
          record.TB = Number($(`.table_type02 table tbody:nth-child(2) tr:nth-child(${i}) td:nth-child(${j+14})`).text())
          record.RBI = Number($(`.table_type02 table tbody:nth-child(2) tr:nth-child(${i}) td:nth-child(${j+15})`).text())
          record.SB = Number($(`.table_type02 table tbody:nth-child(2) tr:nth-child(${i}) td:nth-child(${j+16})`).text())
          record.CS = Number($(`.table_type02 table tbody:nth-child(2) tr:nth-child(${i}) td:nth-child(${j+17})`).text())
          record.BB = Number($(`.table_type02 table tbody:nth-child(2) tr:nth-child(${i}) td:nth-child(${j+18})`).text())
          record.HP = Number($(`.table_type02 table tbody:nth-child(2) tr:nth-child(${i}) td:nth-child(${j+19})`).text())
          record.IB = Number($(`.table_type02 table tbody:nth-child(2) tr:nth-child(${i}) td:nth-child(${j+20})`).text())
          record.SO = Number($(`.table_type02 table tbody:nth-child(2) tr:nth-child(${i}) td:nth-child(${j+21})`).text())
          record.GDP = Number($(`.table_type02 table tbody:nth-child(2) tr:nth-child(${i}) td:nth-child(${j+22})`).text())
          record.SH = Number($(`.table_type02 table tbody:nth-child(2) tr:nth-child(${i}) td:nth-child(${j+23})`).text())
          record.SF = Number($(`.table_type02 table tbody:nth-child(2) tr:nth-child(${i}) td:nth-child(${j+24})`).text())
          record.AVG = Number($(`.table_type02 table tbody:nth-child(2) tr:nth-child(${i}) td:nth-child(${j+25})`).text())
          record.OBP = Number($(`.table_type02 table tbody:nth-child(2) tr:nth-child(${i}) td:nth-child(${j+26})`).text())
          record.SLG = Number($(`.table_type02 table tbody:nth-child(2) tr:nth-child(${i}) td:nth-child(${j+27})`).text())
          record.OPS = Number($(`.table_type02 table tbody:nth-child(2) tr:nth-child(${i}) td:nth-child(${j+28})`).text())
          record.WRC = Number($(`.table_type02 table tbody:nth-child(2) tr:nth-child(${i}) td:nth-child(${j+30})`).text())
          record.WAR = Number($(`.table_type02 table tbody:nth-child(2) tr:nth-child(${i}) td:nth-child(${j+31})`).text())
          
          await this.totalRecordBatterRepository.save(record)
        }
      }
    }
  }

  async careerRecord() {
    const players: PLAYER_INFO[] = await this.playerInfoRepository.createQueryBuilder('playerInfo')
      .select(['playerInfo.kbo_id', 'playerInfo.name', 'playerInfo.team', 'playerInfo.birth_date', 'playerInfo.statiz_id', 'playerInfo.id'])
      .where('playerInfo.statiz_id IS NOT NULL')
      .andWhere('playerInfo.position = "B"')
      // .andWhere('playerInfo.name ="김태군"')
      .getMany();

    const browser = await puppeteer.launch({headless: false, protocolTimeout: 900000});
    const page = await browser.newPage();
    
    for (let player of players) {
      
      await page.goto(`https://statiz.sporki.com/player/?m=year&p_no=${player.statiz_id}`, { waitUntil: 'domcontentloaded', timeout: 10000 });
      await page.waitForSelector('table')
      
      let content = await page.content();
      let $ = cheerio.load(content);


    }
  }
}