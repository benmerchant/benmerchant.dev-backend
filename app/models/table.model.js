const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

var TableSchema = mongoose.Schema({
  dining_area: {type: ObjectId, required: true},
  name: {type: String, required: true}
});

const Table = module.exports = mongoose.model('Table', TableSchema);
