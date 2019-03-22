/*
 * Title: ~/src/index.js
 *
 * Description: start up file
 *
 * Author: Ben Merchant
*/
import {app} from './app';
import http from 'http';
require('dotenv').config();

// get port and DAL info from config
// Express doesn't need DB stuff.
import {config} from './app/config';


// get port # from ENV
// IF .env exists, that will be the same name as the property
// in the config object
const configString = whatEnv(process.env.NODE_ENV);

function whatEnv(nodeEnv) {
  return (nodeEnv ? nodeEnv : undefined);
};

const configurations = config[configString];

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
    console.log(`Server now listening on port ${app.get('port')}`);
    console.log(`NOT CONNECTED but will use database ${app.get('db')}`);
  };
});
