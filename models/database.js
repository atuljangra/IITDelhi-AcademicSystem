// This script creates tables.

var pg = require('pg');
var query = require('pg-query');
var path = require('path');

query.connectionParameters = require(path.join(__dirname, '../', 'config')); 

// CREATE faculty;
query("create table faculty(id serial primary key, name varchar(40), dept varchar(60))", function(err, rows, result) {});

// CREATE students;
query("create table students(id serial primary key, name varchar(40), dept varchar(60), entry varchar(15))", function(err, rows, result) {});

// CREATE courses;
query("create table courses(id serial primary key, name varchar(40), dept varchar(60), code varchar(10))", function(err, rows, result) {});

