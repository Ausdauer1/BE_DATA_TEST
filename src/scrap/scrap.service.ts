import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import { InjectRepository } from '@nestjs/typeorm';
import { PLAYER_INFO } from '../entity/playerInfo.entity';
import { YEAR_RECORD_BATTER } from '../entity/yearRecordBatter.entity';
import { YEAR_RECORD_PITCHER } from '../entity/yearRecordPitcher.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { table } from 'console';

@Injectable()
export class ScrapService {
  constructor(
    @InjectRepository(PLAYER_INFO)
    private playerInfoRepository: Repository<PLAYER_INFO>,

    @InjectRepository(YEAR_RECORD_BATTER)
    private yearRecordBatterRepository: Repository<YEAR_RECORD_BATTER>,

    @InjectRepository(YEAR_RECORD_PITCHER)
    private yearRecordPitcherRepository: Repository<YEAR_RECORD_PITCHER>

  ){}

  
  async scrapeBaseballPlayers(team: string) {
    console.log(team)
    // HT: KIA, LG, OB: 두산, SS : 삼성, SK, NC, KT, LT: 롯데, HH: 한화, WO: 키움
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto("https://www.koreabaseball.com/Player/Search.aspx", { waitUntil: 'domcontentloaded', timeout: 10000 });  
    await page.select('select[name="ctl00$ctl00$ctl00$cphContents$cphContents$cphContents$ddlTeam"]',`${team}`)
    
    let pageNum = 1
    let loadArr = []
    let pageLength : number
    const getLoad = () => { 
      setTimeout(async ()=> {
        
        let content = await page.content();
        let $ = cheerio.load(content);
        
        //let lastLineData = $("#cphContents_cphContents_cphContents_udpRecord > div.inquiry > table > tbody > tr:nth-child(20) > td:nth-child(7)").text()
        //console.log(lastLineData)
        let tableLength = $('.tEx tbody tr').length
        // 이부분 수정 !
        //if (lastLineData === '' || lastLineData === null || lastLineData === undefined) {
        if (tableLength < 1) {
          console.log('tic')
          getLoad()
        } else {
          pageLength = $('.paging a').length - 2
          console.log("-----------------------"+pageLength )
          console.log($('.tEx tbody tr').length)
          
          //console.log($.html())
          console.log(loadArr.length)
          let go = loadArr.length < 1 ? 1 : loadArr[loadArr.length - 1] === $(`.tEx tbody tr:nth-child(1) td:nth-child(1)`).text() ? 0 : 1 

          const printData = async () => {
            console.log("outter go"+go)
            if (go === 1) { 
              loadArr.push($(`.tEx tbody tr:nth-child(1) td:nth-child(1)`).text())
              console.log(loadArr)
              console.log(tableLength)
              for (let i = 1; i <= tableLength; i++) {
                
                const playerUrl = $(`.tEx tbody tr:nth-child(${i}) td:nth-child(2) a`).attr('href')
                
                const playerInfo = new PLAYER_INFO()
                playerInfo.back_number = $(`.tEx tbody tr:nth-child(${i}) td:nth-child(1)`).text().trim()
                playerInfo.name = $(`.tEx tbody tr:nth-child(${i}) td:nth-child(2)`).text().trim()
                playerInfo.team = $(`.tEx tbody tr:nth-child(${i}) td:nth-child(3)`).text().trim()
                playerInfo.position = $(`.tEx tbody tr:nth-child(${i}) td:nth-child(4)`).text().trim() === "투수" ? "P" : "B"
                playerInfo.detail_position = $(`.tEx tbody tr:nth-child(${i}) td:nth-child(4)`).text().trim()
                playerInfo.birth_date = $(`.tEx tbody tr:nth-child(${i}) td:nth-child(5)`).text().trim()
                
                const [height , weight] = $(`.tEx tbody tr:nth-child(${i}) td:nth-child(6)`).text().split(",")
                playerInfo.height = height.trim()
                playerInfo.weight = weight.trim()
                
                playerInfo.career = $(`.tEx tbody tr:nth-child(${i}) td:nth-child(7)`).text().trim()
                
                if (playerUrl.includes("Record")) {
                  playerInfo.kbo_id = playerUrl.substring(playerUrl.indexOf("playerId=") + 9)
                }
                
                await this.playerInfoRepository.save(playerInfo);
                console.log(playerInfo)
                
                // console.log($(`.tEx tbody tr:nth-child(${i}) td:nth-child(1)`).text().trim())
                //console.log($(`.tEx tbody tr:nth-child(${i}) td:nth-child(2)`).text().trim())
                // console.log($(`.tEx tbody tr:nth-child(${i}) td:nth-child(3)`).text().trim())
                // console.log($(`.tEx tbody tr:nth-child(${i}) td:nth-child(4)`).text().trim())
                // console.log($(`.tEx tbody tr:nth-child(${i}) td:nth-child(5)`).text().trim())
                // console.log($(`.tEx tbody tr:nth-child(${i}) td:nth-child(6)`).text().split(','))
                // console.log($(`.tEx tbody tr:nth-child(${i}) td:nth-child(7)`).text().trim())
              }

              pageNum++
              if (pageNum <= pageLength ) {
                await page.click(`[id=cphContents_cphContents_cphContents_ucPager_btnNo${pageNum}]`)
                getLoad()
              }
            } else {
              setTimeout(async() => {
                let content = await page.content();
                $ = cheerio.load(content);
                console.log("ineer go" + go)
                console.log(loadArr)
                console.log(loadArr[loadArr.length - 1])
                console.log($(`.tEx tbody tr:nth-child(1) td:nth-child(1)`).text())
                go = loadArr.length < 1 ? 1 : loadArr[loadArr.length - 1] === $(`.tEx tbody tr:nth-child(1) td:nth-child(1)`).text() ? 0 : 1 
                printData()
              }, 500)
            }
          }
          printData()
        }
      }, 500)
    }

    getLoad()
  
    const players: any[] = [];

    //await browser.close();


    // $('table tbody tr').each((index, element) => {
    //   const number = $(element).find('td:nth-child(1)').text().trim();
    //   const nameElement = $(element).find('td:nth-child(2) a');
    //   const name = nameElement.text().trim();
    //   const playerUrl = nameElement.attr('href');
    //   const playerNoMatch = playerUrl.match(/p_no=(\d+)/);
    //   const playerNo = playerNoMatch ? playerNoMatch[1] : null;

    //   if (name && number && playerNo) {
    //     players.push({ number, name, playerNo });
    //   }
    // });

    // return players;
  }
  async scrapPlayersRecords() {
    const browser = await puppeteer.launch({headless: false, protocolTimeout: 900000});
    const page = await browser.newPage();
    await page.goto("https://statiz.sporki.com/player/", { waitUntil: 'domcontentloaded' });

    const players = await this.playerInfoRepository.createQueryBuilder('playerInfo')
      .select(['playerInfo.kbo_id', 'playerInfo.name', 'playerInfo.team', 'playerInfo.birth_date', 'playerInfo.id', 'playerInfo.detail_position'])
      // .where('playerInfo.kbo_id IS NOT NULL')
      //.andWhere('playerInfo.position = "B"')
      .where('playerInfo.team IN (:...teams)', { teams: ['KIA', 'LG', '두산', '삼성']})
      // .andWhere('playerInfo.position = "P"')
      // .where('playerInfo.name = "임서준"')
      .getMany();                 
      
    // console.log(players)
    for (let player of players) {
      let kbo_position = player.detail_position
      // console.log(kbo_position)
      await page.click('.new_searchPlayer')
      await page.waitForSelector('input[name=s]')
      await page.$eval('input[name=s]', (el, value) => {
        el.value = value;
      }, player.name)
      await page.click('.btn')
      await page.waitForSelector('table')
      
        let content = await page.content();
        let $ = cheerio.load(content);
        
        if ($('.notice_txt span').text().trim() === '안내') {
          console.log('중복')
          const tableLength = $('.table_type01 table tbody tr').length
          for (let i = 1; i <= tableLength; i++) {
            const birth = $(`.table_type01 table tbody tr:nth-child(${i}) td:nth-child(2)`).text().trim()
            //const team = $(`.table_type01 table tbody tr:nth-child(${i}) td:nth-child(4)`).text().trim()
            
            if (birth === player.birth_date){
              await page.click(`.table_type01 table tbody tr:nth-child(${i}) td:nth-child(1) a`)
              await page.waitForSelector('table')

              let content = await page.content();
              let $ = cheerio.load(content);
              
              // if (($('.table_type03 table tbody tr:nth-child(1) td:nth-child(2)').text().substring(0,4)) === "2024") {
                // console.log("여기옴")
                const pageUrl = page.url()
                //const record = new YEAR_RECORD_BATTER();

                // record.name = player.name
                // record.kbo_id_batter = player.kbo_id
                const statiz_id_batter = pageUrl.substring(pageUrl.indexOf("p_no=") + 5)
                // record.oWAR = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(6)').text())
                // record.dWAR = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(7)').text())
                // record.G = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(8)').text())
                // record.PA = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(9)').text())
                // record.ePA = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(10)').text())
                // record.AB = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(11)').text())
                // record.R = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(12)').text())
                // record.H = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(13)').text())
                // record['2B'] = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(14)').text())
                // record['3B'] = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(15)').text())
                // record.HR = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(16)').text())
                // record.TB = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(17)').text())
                // record.RBI = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(18)').text())
                // record.SB = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(19)').text())
                // record.CS = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(20)').text())
                // record.BB = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(21)').text())
                // record.HP = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(22)').text())
                // record.IB = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(23)').text())
                // record.SO = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(24)').text())
                // record.GDP = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(25)').text())
                // record.SH = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(26)').text())
                // record.SF = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(27)').text())
                // record.AVG = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(28)').text())
                // record.OBP = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(29)').text())
                // record.SLG = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(30)').text())
                // record.OPS = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(31)').text())
                // record.WRC = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(33)').text())
                // record.WAR = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(34)').text())
                const birth = $('.man_info li:nth-child(1)').text()
                const regex = /[^0-9]/g;
                const birthNum = birth.replace(regex, "")
                let birthDate = birthNum.slice(0,4) + '-' + birthNum.slice(4,6) + '-' + birthNum.slice(6,8)
                console.log(birthDate, player.birth_date)
                if(birthDate !== player.birth_date) {
                  // console.log(player.name)
                  // let statiz_position = $('.con span:nth-child(2)').text().trim()
                  // if (statiz_position === 'P' || statiz_position === 'C'){
                  //   await this.playerInfoRepository.update(player.id, {
                  //     statiz_id: statiz_id_batter,
                  //   })
                  // } else {
                    await this.playerInfoRepository.update(player.id, {
                      statiz_id: null,
                      
                    })
                  // }
                }
                
              // }

              break;
            }
          }
          
          
        } else {
          // if (($('.table_type03 table tbody tr:nth-child(1) td:nth-child(2)').text().substring(0,4)) === "2024") {
            const pageUrl = page.url()
            console.log('노중복')
            //const record = new YEAR_RECORD_BATTER();
            //record.name = player.name
            // record.kbo_id_batter = player.kbo_id
            const statiz_id_batter = pageUrl.substring(pageUrl.indexOf("p_no=") + 5)
            // record.oWAR = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(6)').text())
            // record.dWAR = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(7)').text())
            // record.G = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(8)').text())
            // record.PA = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(9)').text())
            // record.ePA = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(10)').text())
            // record.AB = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(11)').text())
            // record.R = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(12)').text())
            // record.H = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(13)').text())
            // record['2B'] = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(14)').text())
            // record['3B'] = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(15)').text())
            // record.HR = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(16)').text())
            // record.TB = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(17)').text())
            // record.RBI = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(18)').text())
            // record.SB = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(19)').text())
            // record.CS = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(20)').text())
            // record.BB = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(21)').text())
            // record.HP = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(22)').text())
            // record.IB = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(23)').text())
            // record.SO = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(24)').text())
            // record.GDP = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(25)').text())
            // record.SH = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(26)').text())
            // record.SF = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(27)').text())
            // record.AVG = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(28)').text())
            // record.OBP = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(29)').text())
            // record.SLG = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(30)').text())
            // record.OPS = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(31)').text())
            // record.WRC = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(33)').text())
            // record.WAR = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(34)').text())

            // console.log(record.name)
            
            const birth = $('.man_info li:nth-child(1)').text()
            const regex = /[^0-9]/g;
            const birthNum = birth.replace(regex, "")
            let birthDate = birthNum.slice(0,4) + '-' + birthNum.slice(4,6) + '-' + birthNum.slice(6,8)
            console.log(birthDate, player.birth_date)
            if(birthDate !== player.birth_date) {
              // console.log(player.name)
              // let statiz_position = $('.con span:nth-child(2)').text().trim()
              // if (statiz_position === 'P' || statiz_position === 'C'){
              //   await this.playerInfoRepository.update(player.id, {
              //     statiz_id: statiz_id_batter,
              //   })
              // } else {
                await this.playerInfoRepository.update(player.id, {
                  statiz_id: null,
                  // detail_position: `${kbo_position}(${statiz_position})`
                })
              // }

            }
            
          // }
        }
        function matchData() {
            
          const record = new YEAR_RECORD_BATTER();
          record.kbo_id_batter = player.kbo_id
          const pageUrl = page.url()
          record.statiz_id_batter = pageUrl.substring(pageUrl.indexOf("p_no=") + 5).trim()
          record.oWAR = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(6)').text())
          record.dWAR = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(7)').text())
          record.G = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(8)').text())
          record.PA = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(9)').text())
          record.ePA = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(10)').text())
          record.AB = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(11)').text())
          record.R = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(12)').text())
          record.H = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(13)').text())
          record['2B'] = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(14)').text())
          record['3B'] = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(15)').text())
          record.HR = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(16)').text())
          record.TB = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(17)').text())
          record.RBI = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(18)').text())
          record.SB = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(19)').text())
          record.CS = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(20)').text())
          record.BB = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(21)').text())
          record.HP = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(22)').text())
          record.IB = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(23)').text())
          record.SO = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(24)').text())
          record.GDP = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(25)').text())
          record.SH = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(26)').text())
          record.SF = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(27)').text())
          record.AVG = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(28)').text())
          record.OBP = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(29)').text())
          record.SLG = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(30)').text())
          record.WRC = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(33)').text())
          record.WAR = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(34)').text())

          console.log(record)
        }
        
      
    }
    

  }
  //올해 투수 전체
  async scrapPitcherRecordsThisYear(year: string) {
    console.log(year)
    
    const players = await this.playerInfoRepository.createQueryBuilder('playerInfo')
      .select(['playerInfo.kbo_id', 'playerInfo.name', 'playerInfo.team', 'playerInfo.birth_date'])
      .where('playerInfo.kbo_id IS NOT NULL')
      .andWhere('playerInfo.position = "P"')
      .getMany();
    
    console.log(players)
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto("https://statiz.sporki.com/player/", { waitUntil: 'domcontentloaded', timeout: 10000 });

    for (let player of players) {
      await page.click('.new_searchPlayer')
      await page.waitForSelector('input[name=s]')
      await page.$eval('input[name=s]', (el, value) => { el.value = value }, player.name)
      await page.click('.btn')
      await page.waitForSelector('table')
      // 중복 체크를 위한 콘텐츠 가져오기
      let content = await page.content();
      let $ = cheerio.load(content);
      //중복
      if ($('.notice_txt span').text().trim() === '안내') {
        const tableLength = $('.table_type01 table tbody tr').length
        
        for (let i = 1; i <= tableLength; i++) {
          const birth = $(`.table_type01 table tbody tr:nth-child(${i}) td:nth-child(2)`).text().trim()
          //생년월일 구분
          if (birth === player.birth_date){
            // 데이터 추출을 위한 콘텐츠 가져오기
            await page.click(`.table_type01 table tbody tr:nth-child(${i}) td:nth-child(1) a`)
            await page.waitForSelector('table')
            let content = await page.content();
            let $ = cheerio.load(content);
            
            if (($('.table_type03 table tbody tr:nth-child(1) td:nth-child(2)').text().substring(0,4)) === "2024") {
              
              const pageUrl = page.url()
              const record = new YEAR_RECORD_PITCHER();

              record.name = player.name
              record.year = `${year}`
              record.kbo_id_pitcher = player.kbo_id
              record.statiz_id_pitcher = pageUrl.substring(pageUrl.indexOf("p_no=") + 5)
              
              record.G = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(6)').text());
              record.GS = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(7)').text());
              record.GR = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(8)').text());
              record.GF = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(9)').text());
              record.CG = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(10)').text());
              record.SHO = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(11)').text());
              record.W = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(12)').text());
              record.L = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(13)').text());
              record.S = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(14)').text());
              record.HD = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(15)').text());
              record.IP = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(16)').text());
              record.ER = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(17)').text());
              record.R = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(18)').text());
              record.rRA = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(19)').text());
              record.TBF = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(20)').text());
              record.H = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(21)').text());
              record['2B'] = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(22)').text());
              record['3B'] = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(23)').text());
              record.HR = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(24)').text());
              record.BB = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(25)').text());
              record.HP = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(26)').text());
              record.IB = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(27)').text());
              record.SO = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(28)').text());
              record.ROE = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(29)').text());
              record.BK = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(30)').text());
              record.WP = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(31)').text());
              record.ERA = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(32)').text());
              record.RA9 = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(33)').text());
              record.rRA9 = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(34)').text());
              record.rRA9pf = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(35)').text());
              record.FIP = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(36)').text());
              record.WHIP = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(37)').text());
              record.WAR = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(38)').text());

              console.log(record.name, record.ERA)
              await this.yearRecordPitcherRepository.save(record)
            }
            break;
          }
          
        }
        
      } else {

        if (($('.table_type03 table tbody tr:nth-child(1) td:nth-child(2)').text().substring(0,4)) === "2024") {
              
          const pageUrl = page.url()
          const record = new YEAR_RECORD_PITCHER();

          record.name = player.name
          record.year = `${year}`
          record.kbo_id_pitcher = player.kbo_id
          record.statiz_id_pitcher = pageUrl.substring(pageUrl.indexOf("p_no=") + 5)
          
          record.G = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(6)').text());
          record.GS = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(7)').text());
          record.GR = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(8)').text());
          record.GF = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(9)').text());
          record.CG = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(10)').text());
          record.SHO = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(11)').text());
          record.W = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(12)').text());
          record.L = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(13)').text());
          record.S = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(14)').text());
          record.HD = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(15)').text());
          record.IP = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(16)').text());
          record.ER = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(17)').text());
          record.R = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(18)').text());
          record.rRA = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(19)').text());
          record.TBF = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(20)').text());
          record.H = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(21)').text());
          record['2B'] = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(22)').text());
          record['3B'] = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(23)').text());
          record.HR = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(24)').text());
          record.BB = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(25)').text());
          record.HP = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(26)').text());
          record.IB = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(27)').text());
          record.SO = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(28)').text());
          record.ROE = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(29)').text());
          record.BK = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(30)').text());
          record.WP = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(31)').text());
          record.ERA = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(32)').text());
          record.RA9 = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(33)').text());
          record.rRA9 = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(34)').text());
          record.rRA9pf = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(35)').text());
          record.FIP = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(36)').text());
          record.WHIP = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(37)').text());
          record.WAR = Number($('.table_type03 table tbody tr:nth-child(1) td:nth-child(38)').text());

          console.log(record.name, record.ERA)
          await this.yearRecordPitcherRepository.save(record)
        }
      }
      
    }
      
  }
}
// class = . 
// id = # or [id=]
// input[name=] 