const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const Mixed = Schema.Types.Mixed;

const CelebritySchema = new Schema({
    id:ObjectId, //id
    name:String, //名字
    name_en:String, //英文名
    aka_name:String,//更多中文名
    aka_name_en:String, //更多英文名
    avatar: Mixed, //头像
    summary:String, // 简介
    gender:String, //性别
    birthday:String, //出生日期
    both_place:String, //出生地
    profession:String, //职业
    constellation:String, // 星座
    photos:Array, // 照片
    works:[
        {
            tyoe:ObjectId,
            ref:'Movie'
        }    
    ],// 作品
    meta:{
        createdAt:{
            type:Date,
            default:Date.now()
        },
        updatedAt:{
            type:Date,
            default:Date.now()
        }
    }
});

CelebritySchema.pre('save',function(){
    if(this.isNew){
        this.meta.createdAt = this.meta.updatedAt = Date.now();
    }else{
        this.updatedAt = Date.now();
    }
});

mongoose.model('Celebrity',CelebritySchema);
