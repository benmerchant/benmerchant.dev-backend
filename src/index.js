/*
 * Title: ~/src/index.js
 *
 * Description: stripped down to get AWS working
 *
 * Author: Ben Merchant
*/
require('dotenv').config();
import http from 'http';
import mongoose from 'mongoose';
import morgan from 'morgan';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import {MainComponent} from './components/main/index';



const port = process.env.PORT;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/test?retryWrites=true`;
const options = {useNewUrlParser: true, dbName: process.env.DB_NAME};

const rightThisSecond = new Date(Date.now()).toLocaleString();


console.log(`Welcome to Jurassic Express JS!`);
console.log(`The time is now${rightThisSecond.split(',')[1]} (in Virginia) on ${rightThisSecond.split(',')[0]}`);


const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(morgan('combined'));

app.get('/',(req,res) => {
  res.status(200).json({message: 'Welcome to the site! No one should ever see this. Try the api: ~/api/home'});
});
app.get('/api',(req,res) => {
  res.status(200).json({message: 'Welcome to the API! No one should ever see this. Try the api: ~/api/home'});
});



app.listen(port,(err) => {
  if(err) throw err;
  console.log(`Server listening on port ${port}...`);
  MainComponent(app);
});
