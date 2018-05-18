const puppeteer = require('puppeteer');
const doubanMovieBase = 'https://api.douban.com/v2/movie/'
const rq = require('request-promise-native');
const mongoose = require('mongoose');
// const Movie = mongoose.model('Movie');

process.on('message', async (detailUrl) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(detailUrl, {
        waitUntil: 'networkidle2'
    });
    let movieDetail = await page.evaluate(() => {
        let doubanId = $('.span_block a[href*=douban]').attr('href').match(/\d{1,}/g)[0], language = "", duration = "", release_date = "", countries = "", genres = "";
        $('.span_block .font_888').each(function (index) {
            if ($(this).text().indexOf('语言') > -1) {
                language = $(this).text('').parent('.span_block').text().replace(/\s+/g, ',').split(',').filter(function (item) {
                    return item !== '';
                });
            }
            else if ($(this).text().indexOf('片长') > -1) {
                duration = $(this).text('').parent('.span_block').text().replace(/\s+/g, '');
            }
            else if ($(this).text().indexOf('上映日期') > -1) {
                release_date = $(this).text('').parent('.span_block').text().replace(/\s+/g, '');
            }
            else if ($(this).text().indexOf('地区') > -1) {
                countries = $(this).text('').parent('.span_block').text().replace(/\s+/g, ',').split(',').filter(function (item) {
                    return item !== '';
                });
            }
            else if ($(this).text().indexOf('类型') > -1) {
                genres = $(this).text('').parent('.span_block').text().replace(/\s+/g, ',').split(',').filter(function (item) {
                    return item !== '';
                });
            }
        });
        

        let downloadUrl = [];
        $('.dlbutton1 a').each(function(){
            downloadUrl.push({
                url:$(this).attr('href'),
                title:$(this).attr('thunderrestitle')
            });
        });

        return {
            doubanId,
            language,
            duration,
            release_date,
            countries,
            genres,
            downloadUrl
        };
    });
    await browser.close();
    let doubanMovie = JSON.parse(await rq(doubanMovieBase + 'subject/' + movieDetail.doubanId));
    // let movie = await Movie.findOne({doubanId:movieDetail.doubanId}).exec();
    // if(!movie){
    console.log(doubanMovie);
    let data = {
        doubanId: movieDetail.doubanId,
        name: doubanMovie.title,
        original_name: doubanMovie.original_title,
        aka: doubanMovie.aka,
        rating: doubanMovie.rating && doubanMovie.rating.average,
        images: doubanMovie.images,
        year: doubanMovie.year,
        release_date: movieDetail.release_date,
        duration: movieDetail.duration,
        download_url:movieDetail.downloadUrl,
        language:movieDetail.language,
        summary: doubanMovie.summary,
        type:doubanMovie.subtype,
        genres:doubanMovie.genres,
        countries:doubanMovie.countries,
    }
    console.log(data);
    // }
});
