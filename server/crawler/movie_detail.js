const puppeteer = require('puppeteer');
const doubanMovieBase = 'https://api.douban.com/v2/movie/'
const rq = require('request-promise-native');
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
        $('.dlbutton1 a').each(function () {
            downloadUrl.push({
                url: $(this).attr('href'),
                title: $(this).attr('thunderrestitle')
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
    let data = {
        doubanId: movieDetail.doubanId,
        release_date: movieDetail.release_date,
        duration: movieDetail.duration,
        download_url: movieDetail.downloadUrl,
        countries: movieDetail.countries,
        language: movieDetail.language,
    };
    process.send(data);
});
