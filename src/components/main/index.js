/*
 * Title:
 *
 * Description: this will serve items to the index.html of the entire site
 *
 * Author: Ben Merchant
*/
import path from 'path';
// import fs from 'fs';
'use strict';
import express from 'express';

// get models
import HomeModel from './home.model';

// try the old way for modules
// This is a functions that accepts the express app object
// so that we can mount ONE Middleware on it
// that Middleware carries others with it
export const MainComponent = function(app) {

  const apiRoutes = express.Router();

  const homeRouter = express.Router();

  apiRoutes.use('/home', homeRouter);

  homeRouter.get('/',(req, res, next) => {
    console.log(req.body);
    console.log(req.query);
    console.log(req.params);
    res.status(200).json({
      message: 'You have success: ~/api/home',
      phrases: [
        'these are static phrases',
        'not from Mongo',
        'have to step back'
      ]
    });

  });

  app.use('/api', apiRoutes);
};
