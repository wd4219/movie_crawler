const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const Mixed = Schema.Types.Mixed;

const MovieSchema = new Schema({
    id: ObjectId, //电影ID
    doubanId: {
        type: String,
        unique: true
    }, //电影豆瓣ID
    name: String,//电影名称
    original_name: String,  //电影原名
    aka: Array, //电影其他名称
    rating: Number, //评分
    images: Mixed, //图片
    type: String,
    director: [{
        type: ObjectId,
        ref: 'Celebrity'
    }], //导演
    actor: [
        {
            id:ObjectId,
            name:String,
            actor_name:String
        }
    ], //演员
    writers: [
        {
            type: ObjectId,
            ref: 'Celebrity'
        }
    ], //编剧
    release_date: Array, //上映日期
    download_url:Array, //下载地址
    year: String, //年份
    language: Array, //语言
    duration: String, //片长
    genres: Array, //类型
    countries: Array,//国家
    summary: String, //简介
    photos: Array, //剧照
    poster:Array, //海报
    meta: {
        createdAt: {
            type: Date,
            default: Date.now()
        },
        updatedAt: {
            type: Date,
            default: Date.now()
        }
    }
});

MovieSchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createdAt = this.meta.updatedAt = Date.now();
    } else {
        this.meta.updatedAt = Date.now();
    }
    next();
});

mongoose.model('Movie', MovieSchema);