/*
 * Title: ~/src/index.js
 *
 * Description: start up file
 *
 * Author: Ben Merchant
*/
import {app} from './app';
import http from 'http';
import mongoose from 'mongoose';
// he did say somewhere to do logging elsewhere
// my thought is, you need the config and .env to control it
// the logs are going to be related to requests. hmmm
import morgan from 'morgan';
require('dotenv').config();

// only for development
import {popuationOfDevelopmentDataBase} from './populateDevDB';

// get port and DAL info from config
// Express doesn't need DB stuff.
import {config} from './config';


// get port # from ENV
// IF .env exists, that will be the same name as the property
// in the config object
const THE_ENVIRONMENT = whatEnv(process.env.NODE_ENV);

function whatEnv(nodeEnv) {
  return (nodeEnv ? nodeEnv : undefined);
};

const configurations = config[THE_ENVIRONMENT];

// TODO: combine function and string
// TODO: handle undefined NODE_ENV

// store that port # in Express object
app.set('port',configurations.port);


if(THE_ENVIRONMENT==='production'){
  app.set('uri',`${process.env.DB_ROOT_PROD}${process.env.DB_USER}:${process.env.DB_PASSWORD}@portfolio-cluster-2019-kihqv.mongodb.net/test?retryWrites=true`);

} else {
  // db if 'development' or 'test'
  app.set('uri',process.env.DB_ROOT_LOCAL);

}

// regardless of THE_ENVIRONMENT
app.set('dbName',`${configurations.db}`);


// create HTTP Server
const server = http.createServer(app);

// listen on whatever ENV's port
server.listen(app.get('port'),(err) => {
  if(err) throw err;
  else {
    console.log(`Server now listening on port ${app.get('port')}...`);
    mongoose.connect(`${app.get('uri')}`,{useNewUrlParser: true, dbName: app.get('dbName')},(err) => {
      if(err) throw err;
      else {
        console.log(`Connected to the database: ${app.get('dbName')}...`);
        if(THE_ENVIRONMENT!=="test") {
            // this will run regardless of dev or production for a while.
            // Except tests. of which we have ZERO
            console.log(`populating DEV/Build DB`);
            popuationOfDevelopmentDataBase();
        }
      }
    });
  };
});

// only use logger if not in test mode. ruins the tests
THE_ENVIRONMENT!=="test" ? app.use(morgan('combined')) : console.log('No logging during testing');
