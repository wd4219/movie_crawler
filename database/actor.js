const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const Mixed = Schema.Mixed;

const ActorSchema = new Schema({
    id:ObjectId,
    name:String,
    name_en:String,
    avatar:Mixed,
    summary:String,
    gender:String,
    birthday:String,
    both_place:String,
    profession:String,
    constellation:String,
    photos:String,
    works:String,
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

ActorSchema.pre('save',function(){
    if(this.isNew){
        this.meta.createdAt = this.meta.updatedAt = Date.now();
    }else{
        this.updatedAt = Date.now();
    }
});

mongoose.model('Actor',ActorSchema);
