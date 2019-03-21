/*
 * Title: ~/src/index.js
 *
 * Description: start up file. I'm thinking similar to entry point in webpack
 *
 * Author: Ben Merchant
*/
import app from './app';

import http from 'http';

http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(1330, '127.0.1.1');

console.log('Server running at http://127.0.0.1:1337/');
