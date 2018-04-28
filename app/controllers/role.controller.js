"use strict"
const Role = require('../models/role');

// GET all roles
exports.getRoles = (req, res, next) => {
  Role.find({}).exec((err, roles) => {
    if(err){
      res.status(500).json({error:err});
      return next(err);
    }
    return res.status(200).json({roles: roles});
    return next();
  });
};

// POST create a new role
exports.createRole = (req, res, next) => {
  const newRole = new Role(req.body);
  newRole.save((err, role) => {
    if(err){
      res.status(422).json({error: err});
      return next(err);
    } else {
      return res.status(200).json({msg: 'Role successfully created', role: role});
    }
  });
};
