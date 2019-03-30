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
import cors from 'cors';

// get models
import HomeModel from './home.model';

// try the old way for modules
// This is a functions that accepts the express app object
// so that we can mount ONE Middleware on it
// that Middleware carries others with it
module.exports = function(app) {

  const apiRoutes = express.Router();

  const mainRouter = express.Router();
  apiRoutes.use('/main', mainRouter);
  // main these routes are for the ENTIRE app
  // <html> basically. the entire viewport
  // everything else willl be just for a view or partial
  mainRouter.get('/', (req, res, next) => {
    res.status(200).json({message: 'Welcome to the site!'});
  });

  // api/home
  const homeRouter = express.Router();
  apiRoutes.use('/home', homeRouter);
  homeRouter.get('/',(req, res, next) => {
    console.log(req.body);
    console.log(req.query);
    console.log(req.params);

    const allPhrasesFromMongo = HomeModel.find();
    allPhrasesFromMongo.exec((err,phrasesFromMongo) => {
      if(err) res.status(500).json({
        message: 'Your efforts were fruitless',
        error_bub:err
      });
      else res.status(200).json({
        message: 'Your efforts were successful',
        phrases:phrasesFromMongo
      });
    });
  });

  // api/projects
  const projectsRouter = express.Router();
  apiRoutes.use('/projects', projectsRouter);
  projectsRouter.get('/', (req, res, next) => {
    res.status(200).json({message: 'Welcome to the site!'});
  });

  // api/about
  const aboutRouter = express.Router();
  apiRoutes.use('/about', aboutRouter);
  aboutRouter.get('/', (req, res, next) => {
    res.status(200).json({message: 'Welcome to the site!'});
  });

  // api/blog
  const blogRouter = express.Router();
  apiRoutes.use('/blog', blogRouter);
  blogRouter.get('/', (req, res, next) => {
    res.status(200).json({message: 'Welcome to the site!'});
  });

  app.use('/api', apiRoutes);
};
