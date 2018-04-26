var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

///////////////////////////
// commented out some required fields to test testing

// Employee Schema
var EmployeeSchema = mongoose.Schema({
  login_number: {
    type: Number,
    required: true,  // length 6-digit number
    unique: true
    // index: true
  },
  first_name: {
    type: String,
    required: true
    // required: true
  }

});

module.exports = mongoose.model('Employee', EmployeeSchema);
