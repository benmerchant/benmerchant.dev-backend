const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;


// Employee Schema
const EmployeeSchema = mongoose.Schema({
  login_number: {
    type: Number,
    required: true,  // length 6-digit number
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  pin_num: {
    type: String,
    required: true
  },
  first_name: {
    type: String,
    required: true
  },
  middle_name: {
    type: String,
  },
  last_name: {
    type: String,
    required: true
  },
  ssn: {
    type: Number,
    required: true,
    unique: true
  },
  gender: {
    type: String,
    required: true
  },
  birth_date: {
    type: Date,
    required: true
  },
  display_name: {
    type: String,
    required: true,
    unique: true
  },
  hire_date: {
    type: Date,
    default: Date.now
  },
  roles: [{
    _id: ObjectId,
    name: String,
    salaried: Boolean,
    rate_of_pay: Number,
    manager_privileges: Boolean,
    default_role: Boolean // this will help in-app with drop down boxes
  }],
  availability: {
    monday: { start_time: String, end_time: String, available: { type:Boolean, default:false} },
    tuesday: { start_time: String, end_time: String, available: { type:Boolean, default:false} },
    wednesday: { start_time: String, end_time: String, available: { type:Boolean, default:false} },
    thursday: { start_time: String, end_time: String, available: { type:Boolean, default:false} },
    friday: { start_time: String, end_time: String, available: { type:Boolean, default:false} },
    saturday: { start_time: String, end_time: String, available: { type:Boolean, default:false} },
    sunday: { start_time: String, end_time: String, available: { type:Boolean, default:false} }
  },
  rehired: [
    {
      final_day: Date,
      rehire_date: Date
    }
  ]
});



module.exports = mongoose.model('Employee', EmployeeSchema);
