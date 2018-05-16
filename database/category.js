const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const Mixed = Schema.Mixed;

const CategorySchema = new Schema({
    id: ObjectId,
    name: String,
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

Category.pre('save',function (){
    if(this.isNew){
        this.meta.createdAt = this.meta.updatedAt = Date.now();
    }else{
        this.meta.updatedAt = Date.now();
    }
});

mongoose.model('Category',CategorySchema)