
const puppeteer = require('puppeteer');
const doubanMovieBase = 'https://movie.douban.com/celebrity/1325751/'
const rq = require('request-promise-native');
process.on('message', async (detailUrl) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(detailUrl, {
    waitUntil: 'networkidle2'
  });
  let celebrity = await page.evaluate(() => {
    let gender = "", constellation = "", birthday = "", born_place = "", profession = "", name = "", name_en = '', aka_name = "", aka_name_en = "", avatar = "", summary = "", photos = [];
    $('.info li span').each(function (index) {
      if ($(this).text().indexOf('性别') > -1) {
        gender = $(this).text('li').parent('').text().replace(/\s+/g, '');
      }
      else if ($(this).text().indexOf('职业') > -1) {
        profession = $(this).text('').parent('li').text().trim();
      }
      else if ($(this).text().indexOf('出生地') > -1) {
        born_place = $(this).text('').parent('li').text().trim();
      }
      else if ($(this).text().indexOf('出生日期') > -1) {
        birthday = $(this).text('').parent('li').text().trim();
      }
      else if ($(this).text().indexOf('星座') > -1) {
        constellation = $(this).text('').parent('li').text().tirm();
      }
      else if ($(this).text().indexOf('中文')) {
        aka_name = $(this).text('').parent('li').text().tirm();
      }
      else if ($(this).text().indexOf('外文')) {
        aka_name_en = $(this).text('').parent('li').text().tirm();
      }
    });
    avatar = $('#headline .nbg').attr('href');
    summary = $('.intro all').text();
    $('.pic-col5 img').each(function () {
      photos.push($(this).attr('src'));
    });
    name = $('h1').text().slice(0, $('h1').text().indexOf(' '));
    name_en = $('h1').text().replace(name, '').trim();

    return {
      gender,
      constellation,
      birthday,
      born_place,
      profession,
      name,
      name_en,
      aka_name,
      aka_name_en,
      avatar,
      summary,
      photos
    };
  });
  await browser.close();
  process.send(celebrity);
});

