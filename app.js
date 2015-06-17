var express = require('express');
var app = express();
console.log("Working");
app.use(express.static('public'));
