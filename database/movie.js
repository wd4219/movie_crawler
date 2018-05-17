const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const Mixed = Schema.Types.Mixed;

const MovieSchema = new Schema({
    id: ObjectId,
    doubanId: Number,
    name: String,
    original_name: String,
    aka: String,
    rating: Number,
    images: Mixed,
    type: String,
    director: Array,
    actor: Array,
    writers: Array,
    release_date: String,
    year: String,
    language: Array,
    duration: String,
    genres: Array,
    countries: Array,
    summary: String,
    photos: Array,
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

MovieSchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createdAt = this.meta.updatedAt = Date.now()
    } else {
        this.meta.updatedAt = Date.now()
    }

    next()
})

mongoose.model('Movie', MovieSchema)