const cp = require('child_process');
const { resolve, join } = require('path');
const mongoose = require('mongoose');
const glob = require('glob');
// mongoose.connect('mongodb://localhost/movie');
mongoose.Promise = global.Promise;
// glob.sync(join(__dirname, '../database', '**/*.js')).forEach(require);

(async () => {
  const movieList = cp.fork(resolve(__dirname, '../crawler/movie_list.js'));
  const movieDetail = cp.fork(resolve(__dirname, '../crawler/movie_detail.js'));
  movieList.on('message', (data) => {
    movieDetail.send(data.movieDetails[0]);
  });
})();




