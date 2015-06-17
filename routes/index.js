var express = require('express');
var router = express.Router();
var pg = require('pg');
var path = require('path');

var connectionString = require(path.join(__dirname, '../', 'config')); 

router.get('/', function(req, res, next) {
    console.log("Get at /");
    res.sendFile(path.join(__dirname, '../', 'views', 'index.html'));
    });

// FACULTY. POST Req will add.
router.post('/api/faculty', function(req, res) {

    var results = [];
    console.log(req.params); 
    // Grab data from http request
    var data = {name: req.body.name, dept: req.body.dept};

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {

        // SQL Query > Insert Data
        client.query("INSERT INTO faculty(name, dept) values($1, $2)", [data.name, data.dept]);

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM faculty");

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });
    
        console.log("Post");
        // After all data is returned, close connection and return results
        query.on('end', function() {
            client.end();
            return res.json(results);
        });

        // Handle Errors
        if(err) {
          console.log(err);
        }

    });
});


router.get('/api/faculty', function(req, res) {

    var results = [];

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM faculty ORDER BY id ASC;");

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
            console.log("R:: %s", row.name);
        });

        console.log("Get");

        // After all data is returned, close connection and return results
        query.on('end', function() {
            client.end();
            return res.json(results);
        });

        // Handle Errors
        if(err) {
          console.log(err);
        }

    });

});

router.put('/api/faculty/:faculty_id', function(req, res) {

    var results = [];

    // Grab data from the URL parameters
    var id = req.params.faculty_id;

    // Grab data from http request
    var data = {name: req.body.name, dept: req.body.dept};

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {

        // SQL Query > Update Data
        client.query("UPDATE faculty SET name=($1), dept=($2) WHERE id=($3)", [data.name, data.dept, id]);

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM faculty ORDER BY id ASC");
        console.log("put");
        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            client.end();
            return res.json(results);
        });

        // Handle Errors
        if(err) {
          console.log(err);
        }

    });

});

router.delete('/api/faculty/:faculty_id', function(req, res) {

    var results = [];

    // Grab data from the URL parameters
    var id = req.params.faculty_id;


    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {

        // SQL Query > Delete Data
        client.query("DELETE FROM faculty WHERE id=($1)", [id]);

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM items ORDER BY id ASC");

        console.log("delete");
        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            client.end();
            return res.json(results);
        });

        // Handle Errors
        if(err) {
          console.log(err);
        }

    });

});


module.exports = router;
