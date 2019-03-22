const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const RoleSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  salaried: {
    type: Boolean,
    required: true
  },
  granular_pay: {
    type: Number,
    required: true
  },
  manager_privileges: {
    type: Boolean,
    required: true
  }
});

const Role = module.exports = mongoose.model('Role', RoleSchema);
