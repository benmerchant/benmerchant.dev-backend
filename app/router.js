const express = require('express');
const EmployeeController = require('./controllers/employee.controller');
const RoleController = require('./controllers/role.controller');

module.exports = function(app){
  // route groups
  const apiRoutes = express.Router();
  const employeeRoutes = express.Router();
  const roleRoutes = express.Router();

  // employee routes middleware for apiRoutes
  apiRoutes.use('/employees', employeeRoutes);
  apiRoutes.use('/roles', roleRoutes);


  /// Employee Routes /////////////////////
  // get all employees
  employeeRoutes.get('/', EmployeeController.getEmployees);
  // create new employee
  employeeRoutes.post('/', EmployeeController.createEmployee);
  // get employee by _id
  employeeRoutes.get('/:id', EmployeeController.getOneEmployee);
  // update an employee
  employeeRoutes.put('/:id', EmployeeController.updateEmployee);
  // delete an employee
  employeeRoutes.delete('/:id', EmployeeController.deleteEmployee);

  /// Role Routes /////////////////////
  // get all roles
  roleRoutes.get('/', RoleController.getRoles);
  // create new role
  roleRoutes.post('/', RoleController.createRole);


  // url for all API routes
  app.use('/api', apiRoutes);
};
