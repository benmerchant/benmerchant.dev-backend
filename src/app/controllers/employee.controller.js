"use strict"
const Employee = require('../models/employee');
const Role = require('../models/role');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');

// GET all the employees
exports.getEmployees = (req, res, next) => {
  Employee.find({}).exec((err, employees) => {
    if(err){
      res.status(500).json({error:err});
    }
    return res.status(200).json({employees: employees});
  });
};

// POST create a new employee
exports.createEmployee = [
  // validate req.body
  // now generating temp password

  // only testing password because it doesn't make sense to validate the hashed password in mongoose Schema
  // check('password')
  //   .isLength({min:8}).withMessage('Password must be at least 8 characters')
  //   .isLength({max:24}).withMessage('Password must be no more than characters'),
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
    //newEmployee.password = checkedData.password;
    newEmployee.display_name = `${req.body.first_name} ${req.body.last_name.substring(0,1)}`;

    let tempPassword = 'temporaryPass';
    let tempPinNum = 2358;

    newEmployee.password = tempPassword;
    newEmployee.pin_num = tempPinNum;

    // find the largest login_number: homemade auto increment
    let findQuery = Employee.find().sort({login_number:-1}).limit(1);
    findQuery.exec(
      function(err, emp){
        if(err) console.error(err);
        if(emp.length===0){ // if there are no existing employees
          newEmployee.login_number = 10001;
        } else {
          newEmployee.login_number = emp[0].login_number+1;
        }
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
    );



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



/////////////////////////////////////////
// // strategy must come before login POST request
passport.use(new LocalStrategy({
  // rename fields
  // By default, LocalStrategy expects to find credentials in parameters named
  // username and password. If your site prefers to name these fields differently,
  // options are available to change the defaults.
  // passwordField: 'password'
  usernameField: 'email'
},
  function(email, password, done){
    // 2: working to here so far
    // console.log('hey 2');
    Employee.findOne({email: email}, function(err,user){
      // 4: working here so far
      // console.log('hey 4');
      if(err) return done(err);
      // if there is no username match
      if(!user){
        // 5: working here so far
        // console.log('hey 5 - OR: email not in DB');
        return done(null, false, 'email not in DB.');
      }
      // continue if there is an employee match
      // console.log('hey 5 - OR: found employee');
      // user.password is the hashed password from the DB
      // remember, user is just the session global variable
      // console.log('hey 6 - OR: checking password');
      bcrypt.compare(password, user.password, function(err, isMatch){
        if(err) return done(err);
        if(isMatch){
          // console.log('hey 7 - OR: passwords match');
          return done(null, user);
        } else {
          // console.log('hey 7 - OR: passwords dont match');
          return done(null, false, 'Incorrect password');
        } // BOOM FrickALOOOOOOOOM!!!!! it all works
      });
    });
  }
));

// serialize and deserialize
passport.serializeUser(function(user, done){
  // user is a session variable
  done(null, user.id);
});
passport.deserializeUser(function(id, done){
  Employee.findById(id, function(err, user){
    console.log('this code isnt being invoked in the test, but is normally');
    done(err, user);
  });
});


exports.login = (req, res, next) => {
  passport.authenticate('local', function(err, user, info){
    if(err) return next(err);
    if(!user) {
      // return res.status(401).json({msg: 'Employee login failed', reason: info});
      // return res.status(401).json({auth: false, token: null, reason: info});
      // trying to get around Possibly Unhandled Rejection -- it works
      // i want to get the data from the json response
      // but AngularJS is preventing this
      return res.status(400).json({auth: false, token: null, reason: info});
      // sending 401. AngularJS won't let me get the data. Just use 400...
    }
    req.logIn(user, function(err){
      if(err) return next(err);
      let token = jwt.sign({id:req.user._id},process.env.secret_JWT,{
        expiresIn: 3600 // one hour
      });
      return res.status(200).json({auth: true, token: token});
      // return res.status(200).json({msg: 'Employee successfully logged in', employee: req.user});
    });
  })(req, res, next);
};

exports.logout = (req, res, next) => {
  // if(!req.user) res.status(500).json({msg: 'Why log out if not logged in?'});
  // else {
  //   req.logOut();
  //   return res.status(200).json({msg: 'Employee successfully logged out'});
  // }
  if(!req.user) console.log('no user');
  req.logOut();
  return res.status(200).json({auth: false, token: null});

};
