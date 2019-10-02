#! /usr/bin/env node
'use strict';

const server = require('./app');
const port = process.env.PORT || 3000;

server.listen(port, function() {
  console.log('Server running on port: %d', port);
});
