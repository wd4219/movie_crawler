const mongoose = require('mongoose');
const dbUrl = 'mongodb://localhost/movie';
mongoose.Promise = global.Promise;
const {join} = require('path');
let CONNECT_TIMES = 1;
exports.connect =  async function(){
  return new Promise(function(resolve){
    mongoose.connect(dbUrl);
    mongoose.connection.on('disconnected',function(){
      if(CONNECT_TIMES > 5){
        console.log('少年，你的数据库出问题了，快去修吧');
      }
      else{
        mongoose.connect(dbUrl);
        CONNECT_TIMES++;
      }
    });
    mongoose.connection.on('error',err => {
      console.log(err);
    });
    mongoose.connection.once('open', () => {
      resolve();
      console.log('Connected to MongoDB -> ', dbUrl)
    })
  });
}