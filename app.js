var express = require('express');
var app = express();

// nBody parser for getting the data from post request.
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false }));
var path = require('path');
console.log("Working");
var routes = require('./routes/index');
app.use('/', routes);
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
    var err = new error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function(err, req, res, next) {
    console.log(err);
});

module.exports = app;
