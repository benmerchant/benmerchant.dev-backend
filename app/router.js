const express = require('express');
const EmployeeController = require('./controllers/employee.controller');

module.exports = function(app){
  // route groups
  const apiRoutes = express.Router();
  const employeeRoutes = express.Router();

  // employee routes middleware for apiRoutes
  apiRoutes.use('/employees', employeeRoutes);


  /// Employee Routes /////////////////////
  // get all employees
  employeeRoutes.get('/', EmployeeController.getEmployees);
  // create new employee
  employeeRoutes.post('/', EmployeeController.createEmployee);

  // url for all API routes
  app.use('/api', apiRoutes);
};
