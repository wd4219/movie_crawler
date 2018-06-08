const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const Mixed = Schema.Types.Mixed;

const CelebritySchema = new Schema({
    id: ObjectId, //id
    doubanId:{
        type:String,
        unique:true
    },
    name:String, //名字
    name_en:String, //英文名
    aka_name:{
        type:Array,
        default:[]
    },//更多中文名
    aka_name_en:{
        type:Array,
        default:[]
    }, //更多英文名
    avatar: String, //头像
    summary:{
        type:String,
        default:''
    }, // 简介
    gender:String, //性别
    birthday:String, //出生日期
    born_place:String, //出生地
    profession:Array, //职业
    constellation:String, // 星座
    photos:Array, // 照片
    works:[
        {
            type:ObjectId,
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

CelebritySchema.pre('save',function(next){
    if(this.isNew){
        this.meta.createdAt = this.meta.updatedAt = Date.now();
    }else{
        this.updatedAt = Date.now();
    }
    next();
});

mongoose.model('Celebrity',CelebritySchema);
