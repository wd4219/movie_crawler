const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const CategorySchema = new Schema({
    id: ObjectId,
    name: {
        type: String,
        unique: true
    },
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

CategorySchema.pre('save', function () {
    if (this.isNew) {
        this.meta.createdAt = this.meta.updatedAt = Date.now();
    } else {
        this.meta.updatedAt = Date.now();
    }
});

mongoose.model('Category', CategorySchema);