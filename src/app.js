/*
 * Title: ~/src/app.js
 *
 * Description: API  declaration
 *
 * Author: Ben Merchant
*/
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
// yoni said don't import like this
import mainComponent from './components/main/index';
import cors from 'cors';


// import individual components

console.log('Welcome to Jurassic Express JS');

export const app = express();
const corsOptions = {
  origin: 'false'
};
app.use(cors());

app.use(bodyParser.json());
// why didnt I leave a comment in StartPOS to say why I
// used false here???!?!
app.use(bodyParser.urlencoded({extended:false}));

// import routes
mainComponent(app);
