const express = require('express');

const userRouter = require('./users/userRouter');


const server = express();

server.use('/api/users', logger, userRouter);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`)
});

//custom middleware
function logger(req, res, next) {
  console.log(
    `${req.method} request to route: ${req.originalUrl} at [${new Date().toISOString()}]`
  );
  next();
};


module.exports = server;
