var express = require('express');
var app = express();
console.log("Working");
var routes = require('./routes/index');
app.use('/', routes);
app.use(express.static('public'));

module.exports = app;
