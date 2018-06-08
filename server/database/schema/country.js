const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const Mixed = Schema.Types.Mixed;

const CountrySchema = new Schema({
  name:{
    type:String,
    unique:true
  },
  meta:{
    updatedAt:{
      type:Date,
      default: Date.now()
    },
    createdAt:{
      type:Date,
      default: Date.now()
    }
  }
});

CountrySchema.pre('save', function (next) {
  if (this.isNew) {
      this.meta.createdAt = this.meta.updatedAt = Date.now();
  } else {
      this.meta.updatedAt = Date.now();
  }
  next();
});

mongoose.model('Country', CountrySchema);