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
// store the DB too??? why not
app.set('db',process.env.DB_ROOT+configurations.db);

// create HTTP Server
const server = http.createServer(app);

// listen on whatever ENV's port
server.listen(app.get('port'),(err) => {
  if(err) throw err;
  else {
    console.log(`Server now listening on port ${app.get('port')}...`);
    mongoose.connect(app.get('db'),{useNewUrlParser: true},(err) => {
      if(err) throw err;
      else {
        console.log(`Connected to the database: ${app.get('db')}...`);
        if(THE_ENVIRONMENT!=="test") {
            // this will run regardless for a while.
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
