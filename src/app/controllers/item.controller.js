"use strict"

const Item = require('../models/item.model');

// GET all Item
exports.getItems = (req,res) => {
  Item.find({}).exec((err, items) => {
    if(err) return res.status(422).json({error:err});
    return res.status(200).json({msg: 'Successfully retrieved all items', items: items});
  });
};

// GET one item by ID
exports.getOneItem = (req,res) => {
  Item .findById(req.params.id, (err, item) => {
    if(err) return res.status(422).json({error:err});
    return res.status(200).json({msg: 'Successfully found the item', item: item});
  });
};

// POST new item
exports.createItem = (req,res) => {
  const newItem = new Item(req.body);
  newItem.save((err, item) => {
    if(err) return res.status(422).json({error:err});
    return res.status(200).json({msg: 'Successfully created new item', item: item});
  });
};
