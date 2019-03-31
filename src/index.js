/*
 * Title: ~/src/index.js
 *
 * Description: stripped down to get AWS working
 *
 * Author: Ben Merchant
*/
import http from 'http';
import mongoose from 'mongoose';
import morgan from 'morgan';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import mainComponent from './components/main/index';
import cors from 'cors';

const port = 3000;
const uri = "mongodb+srv://benjAdmin:ScreechAndLisa@portfolio-cluster-2019-kihqv.mongodb.net/test?retryWrites=true";
const options = {useNewUrlParser: true, dbName: 'bmdevprod'};

console.log('Welcome to Jurassic Express JS');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(morgan('combined'));

app.get('/',(req,res) => {
  res.status(200).json({message: 'Welcome to the site!'});
});

app.listen(port,(err) => {
  if(err) throw err;
  console.log(`Server listening on port ${port}`);
});

mainComponent(app);
