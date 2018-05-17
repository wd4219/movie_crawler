const puppeteer = require('puppeteer');
const doubanMovieBase = 'https://api.douban.com/v2/movie/'
const rq = require('request-promise-native');
const mongoose = require('mongoose');
const Movie = mongoose.model('Movie');
process.on('message',async (detailUrl)=>{
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(detailUrl, {
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
    console.log(await Movie.find({}));
});
