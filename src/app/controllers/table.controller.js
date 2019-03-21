"use strict"

const Table = require('../models/table.model.js');

exports.getTables = (req, res) => {
  Table.find({}).exec((err, tables) => {
    if(err) res.status(422).json({error: err});
    else return res.status(200).json({msg: 'Successfully retrieved all tables', tables: tables});
  });
};

exports.createNewTable = (req, res) => {
  const newTable = new Table(req.body);
  newTable.save((err,table) => {
    if(err) res.status(422).json({error: err});
    else return res.status(200).json({msg: 'Successfully created new table', table: table});
  });
};
