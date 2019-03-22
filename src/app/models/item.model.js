var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var ItemSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  price: {
    type: Number,
    required: true
  },
  menu: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    menu_heading: {
      type: String,
      required: true,
      index: true
    }
  },
  count: {type: Number},
  description: {type: String},
  added_by: {
    _id: {type: mongoose.Schema.Types.ObjectId},
    name: {type: String}
  }
});

var Item = module.exports = mongoose.model('Item', ItemSchema);
