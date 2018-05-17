const cp = require('child_process');
const {resolve}  = require('path');
const movieList = cp.fork(resolve(__dirname,'../crawler/movie_list.js'));
const movieDetail = cp.fork(resolve(__dirname,'../crawler/movie_detail.js'));
const mongoose = require('mongoose');
const {join} = require('path');
mongoose.connect('mongodb://localhost/movie');
const glob = require('glob');
console.log(glob.sync(join(__dirname, '../database', '**/*.js')))
glob.sync(join(__dirname, '../database', '**/*.js')).forEach(require)

movieList.on('message',(data)=>{
  movieDetail.send(data.movieDetails[0]);
});


