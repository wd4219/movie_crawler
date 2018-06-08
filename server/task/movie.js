const cp = require('child_process');
const { resolve, join } = require('path');
const mongoose = require('mongoose');
const {connect} = require('../database/init');
const glob = require('glob');
const puppeteer = require('puppeteer');
glob.sync(join(__dirname, '../database/schema', '**/*.js')).forEach(require);
const doubanMovieBase = 'https://api.douban.com/v2/movie/'
const rq = require('request-promise-native');
async function fetchData(url){
  let res = await rq(url);
  try {
    res = JSON.parse(res);
  } catch (err) {
    res = null;
  }
  return res;
}

(async () => {
  await connect();
  mongoose.Promise = global.Promise;
  const movieList = cp.fork(resolve(__dirname, '../crawler/movie_list.js'));
  const movieDetail = cp.fork(resolve(__dirname, '../crawler/movie_detail.js'));
  movieList.on('message', (data) => {
    movieDetail.send(data.movieDetails[0]);
  });
  const Movie = mongoose.model('Movie');
  const Language = mongoose.model('Language');
  const Category = mongoose.model('Category');
  const Country = mongoose.model('Country');
  const Celebrity = mongoose.model('Celebrity');
  movieDetail.on('message',async(data)=>{
    const url = doubanMovieBase + 'subject/' + data.doubanId;
    let doubanId = data.doubanId;
    const doubanMovie = await fetchData(url);
    data.language.forEach(async (item)=>{
      let language = await Language.findOne({name:item});
      if(!language){
        language = new Language({name:item});
        await language.save();
      }
    });
    data.countries.forEach(async (item)=>{
      let country = await Country.findOne({name:item});
      if(!country){
        country = new Country({name:item});
        await country.save();
      }
    });
    doubanMovie.genres.forEach(async (item)=>{
      let category = await Category.findOne({name:item});
      if(!category){
        category = new Category({name:item});
        await category.save();
      }
    });
    data.name = doubanMovie.title;
    data.original_name = doubanMovie.original_title;
    data.aka = doubanMovie.aka;
    data.rating = doubanMovie.rating && doubanMovie.rating.average;
    doubanMovie.casts.forEach(async(item)=>{
      let celebrity = await Celebrity.findOne({doubanId:item.id}).exec();
      if(!celebrity){
        let data = {};
        data.doubanId = item.id;
        celebrity = new Celebrity(data);
        await celebrity.save();
      }
    });
    let movie = await Movie.findOne({doubanId:data.doubanId});
    if(!movie){
      movie = new Movie(data);
      await movie.save();
    }
  });
})();




