/*
 * Title: ~/src/app.js
 *
 * Description: API  declaration
 *
 * Author: Ben Merchant
*/
import express from 'express';
import bodyParser from 'body-parser';

// import individual components

console.log('Welcome to Jurassic Express JS');

export const app = express();

app.use(bodyParser.json());
// why didnt I leave a comment in StartPOS to say why I
// used false here???!?!
app.use(bodyParser.urlencoded({extended:false}));
