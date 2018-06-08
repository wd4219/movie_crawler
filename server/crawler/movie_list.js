const puppeteer = require('puppeteer');
const listUrl = 'https://www.80s.tw/movie/list/';
const movieDetails = [];

async function getMovieDetailUrl(listUrl){
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(listUrl,{
    waitUntil: 'networkidle2'
  });
  let movieDetail = await page.evaluate(() => {
    var movieDetail = [];
    $('.me1 li > a').each(function(index,item){
        movieDetail.push(item.href);
    });
    return movieDetail;
  });
  movieDetails.push(...movieDetail);
  process.send({
    movieDetails
  });
  await browser.close();
}
getMovieDetailUrl(listUrl);


process.on('message',(listUrl)=>{
  getMovieDetailUrl(listUrl);
});