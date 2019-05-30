const express = require('express');

const userRouter = require('./users/userRouter');

const server = express();

server.use('/api/users', express.json(), logger, userRouter);

server.get('/', (req, res) => {
  const messageOfTheDay = process.env.MOTD || "Hello devs!";
  res.status(200).json({ messageOfTheDay })
});

//custom middleware
function logger(req, res, next) {
  console.log(
    `${req.method} request to route: ${req.originalUrl} at [${new Date().toISOString()}]`
  );
  next();
};


module.exports = server;
