import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import { InjectRepository } from '@nestjs/typeorm';
import { PLAYER_INFO } from './entity/playerInfo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ScrapService {
  constructor(
    @InjectRepository(PLAYER_INFO)
    private catsRepository: Repository<PLAYER_INFO>
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
                // console.log($(`.tEx tbody tr:nth-child(${i}) td:nth-child(1)`).text().trim())
                console.log($(`.tEx tbody tr:nth-child(${i}) td:nth-child(2)`).text().trim())
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
              }, 100)
            }
          }
          printData()
        }
      }, 100)
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
}
