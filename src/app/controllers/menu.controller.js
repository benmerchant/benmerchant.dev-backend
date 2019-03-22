"use strict"

const Menu = require('../models/menu.model');

// get all menu headings
exports.getMenus = (req,res) => {
  Menu.find({}).exec((err, menus) => {
    if(err) return res.status(422).json({error:err});
    return res.status(200).json({msg: 'Successfully retrieved all menus', menus: menus});
  });
};

// POST a new menu heading
exports.createMenu = (req,res) => {
  const newMenu = new Menu(req.body);
  newMenu.save((err, menu) => {
    if(err) return res.status(422).json({error:err});
    return res.status(200).json({msg: 'Successfully created new menu', menu: menu});
  });
};

// GET one menu by ID
exports.getOneMenu = (req,res) => {
  Menu.findById(req.params.id, (err, menu) => {
    if(err) return res.status(422).json({error:err});
    return res.status(200).json({msg: 'Successfully found the menu', menu: menu});
  });
};
