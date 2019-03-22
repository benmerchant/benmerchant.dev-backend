/*
 * Title:
 *
 * Description: this will serve items to the index.html of the entire site
 *
 * Author: Ben Merchant
*/

'use strict';
import express from 'express';


// export const mainComponent = function() {
//   const mainComponent = express.Router();
//
//   mainComponent.get('/', (req, res, next) => {
//     res.send(200).json({message: 'Welcome to the site!'});
//   });
// };

// try the old way for modules
// This is a functions that accepts the express app object
// so that we can mount ONE Middleware on it
// that Middleware carries others with it
module.exports = function(app) {

  const apiRoutes = express.Router();

  const mainRouter = express.Router();
  apiRoutes.use('/main', mainRouter);
  mainRouter.get('/', (req, res, next) => {
    res.status(200).json({message: 'Welcome to the site!'});
  });


  app.use('/api', apiRoutes);
};
