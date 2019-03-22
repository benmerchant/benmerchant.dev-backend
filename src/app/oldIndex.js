const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const session = require('express-session');
const expressValidator = require('express-validator');

const { matchedData, sanitize } = require('express-validator/filter');
const config = require('./app/config');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// get Routes
const router = require('./app/router');

// init app
const app = express();

let db;

// for dev purposes only
process.env.secret_JWT = 'super secret string';


if(process.env.NODE_ENV === "test"){
  db = mongoose.connect(config.test_db);
  app.listen(config.test_port, function(err){
    if(err) console.error(err);
    console.log('Server listening on port ' + config.test_port);
    // this is showing up where I dont't want it in my tests
    // mongoose.connection.on('connected', function(){
    //   console.log('Mongoose connected to ' + config.test_db);
    // });
  });
} else {
  db = mongoose.connect(config.db);
  app.set('port', config.port);
  app.listen(app.get('port'), function(err){
    if(err) console.error(err);
    console.log('Server listening on port ' + app.get('port'));
    mongoose.connection.on('connected', function(){
      console.log('Mongoose connected to ' + config.db);
    });
  });
}

// don't show logs during testing
if(process.env.NODE_ENV !== "test"){
  app.use(morgan('combined'));
}

// app.use(cors({origin: 'http://localhost:3000'}));
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

// initialize Passport.js
app.use(passport.initialize());
// there is only one Express session (initialized above)
// we piggyback passport off of it
app.use(passport.session());

app.use(expressValidator({}));

app.use(function(req, res, next){
  res.locals.user = req.user || null;
  next();
});

// import routes
router(app);

module.exports = app;
