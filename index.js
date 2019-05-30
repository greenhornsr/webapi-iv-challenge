require('dotenv').config();

// const express = require('express')
const server = require('./server')


port = process.env.PORT || 4000
server.listen(port, () => console.log(`\n***Server is listening on http://localhost:${port}***\n`))