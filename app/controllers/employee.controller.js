"use strict"
const Employee = require('../models/employee');
const Role = require('../models/role');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

// GET all the employees
exports.getEmployees = (req, res, next) => {
  Employee.find({}).exec((err, employees) => {
    if(err){
      res.status(500).json({error:err});
      return next(err);
    }
    return res.status(200).json({employees: employees});
    return next();
  });
};

// POST create a new employee
exports.createEmployee = [
  // validate req.body
  // only testing password because it doesn't make sense to validate the hashed password in mongoose Schema
  check('password')
    .isLength({min:8}).withMessage('Password must be at least 8 characters')
    .isLength({max:24}).withMessage('Password must be no more than characters'),
    // have to check last name here so that we can ensure display_name wont attempt
    // substring() on undefined
  check('last_name')
    .exists().withMessage('Must enter a last name'),
  (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(422).json({errors: errors.mapped()});
    }
    const checkedData = matchedData(req);
    const newEmployee = new Employee(req.body);
    // this is the only field we're checking with express-validator
    newEmployee.password = checkedData.password;
    newEmployee.display_name = `${req.body.first_name} ${req.body.last_name.substring(0,1)}`;


    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newEmployee.password, salt, (err, hash) => {
        newEmployee.password = hash;
        newEmployee.save((err, employee) => {
          if(err){
            // console.error(err);
            res.status(500).json({error:err});
            return next(err);
          } else {
            return res.status(200).json({msg: 'Employee successfully added', employee: employee});
          }
        });
      });
    });
  }
];

// GET one employee by _id
exports.getOneEmployee = (req, res, next) => {
  Employee.findById(req.params.id, (err, employee) => {
    if(err) res.status(500).json({error: err});
    else return res.status(200).json({msg: 'Successfully found employee', employee: employee});
  });
};

// PUT update one employee by _id
exports.updateEmployee = (req, res, next) => {
  Employee.findByIdAndUpdate(
    req.params.id,
    req.body,
    {new: true},
    (err, employee) => {
      if(err) res.status(422).json({error: err});
      else return res.status(200).json({msg: 'Successfully updated employee', employee: employee});
    }
  );
};

// PUT - assign role to employee
// accepts params of employee id and role id
// searches db for the role and creates new object to push to employee.roles array
exports.assignRole = (req,res,next) => {
  Role.findById(req.params.role_id, (err, role) => {
    // check if the req.body has different values for certain fields
    // if so assign those, if not, fall back to the values stored in the
    // db for the role model
    const newRole = {
      _id: role._id,
      name: role.name,
      salaried: role.salaried,
      rate_of_pay: (req.body.granular_pay || role.granular_pay),
      manager_privileges: (req.body.manager_privileges || role.manager_privileges)
    };
    Employee.findByIdAndUpdate(
      req.params.id,
      {$push: {roles: newRole}},
      {new: true, safe: true},
      (err, employee) => {
        if(err) res.status(422).json({error: err});
        else return res.status(200).json({msg: 'Successfully assingned new role', employee: employee});
      }
    );
  });
};

// DELETE remove an employee by _id
exports.deleteEmployee = (req, res, next) => {
  Employee.remove({_id: req.params.id}, (err, result) => {
    if(err) res.status(422).json({error: err});
    else return res.status(200).json({result, msg: 'Successfully deleted employee'});
  });
};
