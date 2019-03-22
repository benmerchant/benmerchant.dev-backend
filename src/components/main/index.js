/*
 * Title:
 *
 * Description: this will serve items to the index.html of the entire site
 *
 * Author: Ben Merchant
*/

'use strict';
import express from 'express';

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

  // main/home
  const homeRouter = express.Router();
  apiRoutes.use('/home', homeRouter);
  homeRouter.get('/', (req, res, next) => {
    // send an array of phrases for the toggler
    const phrases = [
      'Howdy!',
      'Great day to be alive!',
      'I <3 JavaScript!',
      'No MongoDB FontAwesome logo...',
      'Paid an artist for the logo',
      'Need to write some tests',
      'Half of life is learning who you are.',
      'Last season of Game of Thrones...',
      'I am very over SQL',
      'Refactoring is more fun than starting from scratch',
      'Google > Apple > Amazon. But iPhone over everything',
      'These are not from a database... yet.',
      'I refuse to go back to not liking who I was'
    ];
    res.status(200).json({phrases:phrases});
  });

  // main/projects
  const projectsRouter = express.Router();
  apiRoutes.use('/projects', projectsRouter);
  projectsRouter.get('/', (req, res, next) => {
    res.status(200).json({message: 'Welcome to the site!'});
  });

  // main/about
  const aboutRouter = express.Router();
  apiRoutes.use('/about', aboutRouter);
  aboutRouter.get('/', (req, res, next) => {
    res.status(200).json({message: 'Welcome to the site!'});
  });

  // main/blog
  const blogRouter = express.Router();
  apiRoutes.use('/blog', blogRouter);
  blogRouter.get('/', (req, res, next) => {
    res.status(200).json({message: 'Welcome to the site!'});
  });

  app.use('/api', apiRoutes);
};
