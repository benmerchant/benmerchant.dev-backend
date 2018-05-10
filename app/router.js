const express = require('express');

const EmployeeController = require('./controllers/employee.controller');
const RoleController = require('./controllers/role.controller');
const RestaurantController = require('./controllers/restaurant.controller');
const TableController = require('./controllers/table.controller');
const MenuController = require('./controllers/menu.controller');
const ItemController = require('./controllers/item.controller');

module.exports = function(app){
  // route groups
  const apiRoutes = express.Router();
  const employeeRoutes = express.Router();
  const roleRoutes = express.Router();
  const restaurantRoutes = express.Router();
  const loginRoutes = express.Router();
  const tableRoutes = express.Router();
  const menuRoutes = express.Router();
  const itemRoutes = express.Router();

  // employee routes middleware for apiRoutes
  apiRoutes.use('/employees', employeeRoutes);
  apiRoutes.use('/roles', roleRoutes);
  apiRoutes.use('/restaurant', restaurantRoutes);
  apiRoutes.use('/login', loginRoutes);
  apiRoutes.use('/tables', tableRoutes);
  apiRoutes.use('/menus', menuRoutes);
  apiRoutes.use('/items', itemRoutes);

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

  // / Login Routes /////////////////////
  loginRoutes.post('/', EmployeeController.login);
  // LOGOUT
  loginRoutes.get('/', EmployeeController.logout);


  /// Role Routes /////////////////////
  // get all roles
  roleRoutes.get('/', RoleController.getRoles);
  // create new role
  roleRoutes.post('/', RoleController.createRole);
  // get one role by _id
  roleRoutes.get('/:id', RoleController.getOneRole);
  // delete one role by _id
  roleRoutes.delete('/:id', RoleController.deleteRole);
  // update role by _id
  roleRoutes.put('/:id', RoleController.updateRole);

  /// Restaurant Routes /////////////////////
  // GET restaurant document
  restaurantRoutes.get('/:id', RestaurantController.getRestaurant);
  // create new restaurant
  restaurantRoutes.post('/', RestaurantController.createRestaurant);
  // update restaurant hours
  restaurantRoutes.put('/:id', RestaurantController.updateRestaurant);
  // add dining dining_areas
  restaurantRoutes.put('/add/diningarea/:restaurantID', RestaurantController.addDiningArea);

  /// Table Routes //////////////////////
  // Get all tables
  tableRoutes.get('/', TableController.getTables);
  // Post a new table
  tableRoutes.post('/', TableController.createNewTable);

  /// Menu Routes /////////////////////
  // GET all headings
  menuRoutes.get('/', MenuController.getMenus);
  // POST a new heading
  menuRoutes.post('/', MenuController.createMenu);
  // GET a menu by heading
  menuRoutes.get('/:id', MenuController.getOneMenu);

  /// Employee Routes /////////////////////
  // GET all items
  itemRoutes.get('/', ItemController.getItems);
  // GET one item by id
  itemRoutes.get('/:id', ItemController.getOneItem);
  // POST new item
  itemRoutes.post('/', ItemController.createItem);


  // url for all API routes
  app.use('/api', apiRoutes);
};
