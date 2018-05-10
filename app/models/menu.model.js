const mongoose = require('mongoose');

// this is for the overall menu not each item
const MenuSchema = mongoose.Schema({
  menu_heading: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  printer:{
    type:String
  }
});

var Menu = module.exports = mongoose.model('Menu', MenuSchema);
