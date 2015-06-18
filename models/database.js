// This scrips creates tables.
//
var pg = require('pg');
var path = require('path');
var connectionString = require(path.join(__dirname, '../', 'config')); 

// CREATE FACULTY;
var client = new pg.Client(connectionString);
client.connect(function (err) {
    if (err) {
        return console.error("Could not connect to postgres", err);
    }


    client.query("CREATE TABLE faculty(id SERIAL PRIMARY KEY, name VARCHAR(40) \
            not null, dept VARCHAR(60))", function(err, result) {
                if (err) {
                    return console.error("Unable to execute Query", err);
                }

                client.end();
                
            });
    
});

//CREATE STUDENTS;
var studentclient = new pg.Client(connectionString);
studentclient.connect(function (err) {
    if (err) {
        return console.error("Could not connect to postgres", err);
    }


    studentclient.query("CREATE TABLE students(id SERIAL PRIMARY KEY, name VARCHAR(40) \
            not null, dept VARCHAR(60), entry VARCHAR(15))", function(err, result) {
                if (err) {
                    return console.error("Unable to execute Query", err);
                }

                studentclient.end();
                
            });
    
});

// CREATE COURSES;
var coursesclient = new pg.Client(connectionString)
coursesclient.connect(function (err) {
    if (err) {
        return console.error("Could not connect to postgres", err);
    }


    coursesclient.query("CREATE TABLE courses(id SERIAL PRIMARY KEY,name VARCHAR(40), dept VARCHAR(60), \
    code VARCHAR(10) not null)", function(err, result) {
                if (err) {
                    return console.error("Unable to execute Query", err);
                }

                coursesclient.end();
                
            });
    
});


