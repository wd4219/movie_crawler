const doubanCelebrity = 'https://m.douban.com/movie/celebrity/'
const rq = require('request-promise-native');
const puppeteer = require('puppeteer');
async function fetchData(){
  const url = doubanMovieBase + 'subject/' + movieDetail.doubanId;
  let res = await rp(url);
  try {
    res = JSON.parse(res);
  } catch (err) {
    res = null;
  }
  return res;
}

exports.getCelebrity = async function(id){
  const url = doubanCelebrity + id;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, {
      waitUntil: 'networkidle2'
  });
  let celebrity = await page.evaluate(() => {
    let result = {};
    result.summary = $('.celebrity-intro p').data('content') || '';
    result.photos = [];
    $('.celebrity-photos .pic img').each(function(){
      result.photos.push($(this).attr('src'));
    });
    return result;
  });
  await browser.close();
  return celebrity;
}