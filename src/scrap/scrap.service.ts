import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';

@Injectable()
export class ScrapService {
  async scrapeBaseballPlayers(url: string) {

    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto("https://www.koreabaseball.com/Player/Search.aspx", { waitUntil: 'domcontentloaded', timeout: 10000 });  
    await page.select('select[name="ctl00$ctl00$ctl00$cphContents$cphContents$cphContents$ddlTeam"]','HT')
    
    
    const getLoad = () => { 
      setTimeout(async ()=> {
        
        let content = await page.content();
        let $ = cheerio.load(content);
        
        let lastLineData = $("#cphContents_cphContents_cphContents_udpRecord > div.inquiry > table > tbody > tr:nth-child(20) > td:nth-child(7)").text()
        let test = $("cphContents_cphContents_cphContents_udpRecord > div.inquiry > table > tbody > tr").length

        if (lastLineData === '' || lastLineData === null || lastLineData === undefined) {
          console.log('tic')
          getLoad()
        } else {
          //console.log($.html())
          console.log($('.tEx tbody tr').length)
          console.log($('.tEx tbody tr:nth-child(20) td:nth-child(7)').text())
          console.log(lastLineData)
          console.log(test)
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
