const cp = require('child_process');
const {resolve}  = require('path');
const movieList = cp.fork(resolve(__dirname,'./movie_list.js'));
const movieDetail = cp.fork(resolve(__dirname,'./movie_detail.js'));

