"use strict"
const Role = require('../models/role');
const Employee = require('../models/employee');

// GET all roles
exports.getRoles = (req, res, next) => {
  Role.find({}).exec((err, roles) => {
    if(err) res.status(500).json({error:err});
    else return res.status(200).json({roles: roles});});
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

// GET one role by _id
exports.getOneRole = (req, res, next) => {
  Role.findById(req.params.id).exec((err, role) => {
    if(err) return res.status(500).json({error: err});
    else return res.status(200).json({msg: 'Successfully located role', role: role});
  });
};

// DELETE one role by _id
exports.deleteRole = (req, res, next) => {
  // ensure there are no employees assigned this role
  // if there are, return the list of employees assigned
  Employee.find({})
  Employee.find( {'roles._id': req.params.id }).exec((err, employees) => {
    if(err) return res.status(422).json({error: err});
    else {
      if(employees.length === 0){
        Role.remove({_id: req.params.id}, (err, result) => {
          if(err) return res.status(422).json({error: err});
          else return res.status(200).json({result, msg: 'Successfully deleted role'});
        });
      } else {
        return res.status(409).json({msg: 'Cannot delete role, assigned to employees', employees: employees});
      }
    }
  });


};
