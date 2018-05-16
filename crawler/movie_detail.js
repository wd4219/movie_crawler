const puppeteer = require('puppeteer');
const detailList = 'https://www.80s.tw/movie/22815';
const doubanMovieBase = 'https://api.douban.com/v2/movie/'
const rq = require('request-promise-native');
const mongoose = require('mongoose');


(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(detailList, {
        waitUntil: 'networkidle2'
    });
    let movieDetail = await page.evaluate(() => {
        let doubanId = $('.span_block a[href*=douban]').attr('href').match(/\d{1,}/g)[0];
        return {
            doubanId
        };
    });
    await browser.close();
    let movie = await rq(doubanMovieBase+'subject/'+movieDetail.doubanId);
    
})();