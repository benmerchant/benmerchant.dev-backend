const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

var RestaurantSchema = mongoose.Schema({
  store_number: {
    type: Number,
    required: true,
    unique: true,
    index:true
  },
  name: {
    type: String,
    requred: true
  },
  state_tax: {
    type: Number,
    required: true
  },
  local_tax: {
    type: Number,
    required: true
  },
  store_hours: {
    monday: { start_time: Number, end_time: Number, open: { type:Boolean, default:false} },
    tuesday: { start_time: Number, end_time: Number, open: { type:Boolean, default:false} },
    wednesday: { start_time: Number, end_time: Number, open: { type:Boolean, default:false} },
    thursday: { start_time: Number, end_time: Number, open: { type:Boolean, default:false} },
    friday: { start_time: Number, end_time: Number, open: { type:Boolean, default:false} },
    saturday: { start_time: Number, end_time: Number, open: { type:Boolean, default:false} },
    sunday: { start_time: Number, end_time: Number, open: { type:Boolean, default:false} }
  },
  dining_areas: [
    {name: String}
  ]
});

const Restaurant = module.exports = mongoose.model('Restaurant', RestaurantSchema);
