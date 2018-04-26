"use strict"
const Employee = require('../models/employee');
const { check, validationResult } = require('express-validator/check');

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
exports.createEmployee = (req, res, next) => {
  const newEmployee = new Employee(req.body);
  newEmployee.save((err, employee) => {
    if(err){
      res.status(500).json({error:err});
      return next(err);
    } else {
      return res.status(200).json({msg: 'Employee successfully added', employee: employee});
    }
  });
};
