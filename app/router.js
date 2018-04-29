const express = require('express');
const EmployeeController = require('./controllers/employee.controller');
const RoleController = require('./controllers/role.controller');
const RestaurantController = require('./controllers/restaurant.controller');

module.exports = function(app){
  // route groups
  const apiRoutes = express.Router();
  const employeeRoutes = express.Router();
  const roleRoutes = express.Router();
  const restaurantRoutes = express.Router();

  // employee routes middleware for apiRoutes
  apiRoutes.use('/employees', employeeRoutes);
  apiRoutes.use('/roles', roleRoutes);
  apiRoutes.use('/restaurant', restaurantRoutes);


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
  // update employee - assign role by id
  employeeRoutes.put('/:id/assignrole/:role_id', EmployeeController.assignRole);

  /// Role Routes /////////////////////
  // get all roles
  roleRoutes.get('/', RoleController.getRoles);
  // create new role
  roleRoutes.post('/', RoleController.createRole);
  // get one role by _id
  roleRoutes.get('/:id', RoleController.getOneRole);
  // delete one role by _id
  roleRoutes.delete('/:id', RoleController.deleteRole);

  /// Restaurant Routes /////////////////////
  // GET restaurant document
  restaurantRoutes.get('/', RestaurantController.getRestaurant);
  // create new restaurant
  restaurantRoutes.post('/', RestaurantController.createRestaurant);
  // update restaurant hours
  restaurantRoutes.put('/:id', RestaurantController.updateRestaurant);

  // url for all API routes
  app.use('/api', apiRoutes);
};
