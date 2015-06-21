var express = require('express');
var router = express.Router();
var pg = require('pg');
var query = require('pg-query');
var path = require('path');

query.connectionParameters = require(path.join(__dirname, '../', 'config')); 

router.get('/', function(req, res, next) {
    console.log("Get at /");
    res.sendFile(path.join(__dirname, '../', 'views', 'index.html'));
});

var query_res = function(query_string, res) {

    query(query_string, function(err, rows, result) {
    
        if(err) {
        
            console.log('Error: ' + err);
            return res.json([]);
        
        }
        return res.json(rows);
    
    });

}

//Fetch faculty list
router.get('/api/faculty', function(req, res) {

    return query_res("SELECT * FROM faculty ORDER BY id ASC",res);

});

//Fetch students list
router.get('/api/students', function(req, res) {

    return query_res("SELECT * FROM students ORDER BY id ASC",res);

});

//Fetch courses list
router.get('/api/courses', function(req, res) {

    return query_res("SELECT * FROM courses ORDER BY id ASC",res);

});

// FACULTY. POST Req will add.
router.post('/api/faculty', function(req, res) {

    console.log(req.body);
    // Grab data from http request
    var data = {name: req.body.name, dept: req.body.dept};
    query("INSERT INTO faculty(name, dept) values($1, $2)", [data.name, data.dept], function(err, rows, result) {
    
        if(err){
            console.log('Error: ' + err);
        }
        return query_res("select * from faculty", res);
    
    });

});

// STUDENTS. POST Req will add.
router.post('/api/students', function(req, res) {

    // Grab data from http request
    var data = {name: req.body.name, dept: req.body.dept, entry: req.body.entry};
    query("INSERT INTO students(name, dept, entry) values($1, $2, $3)", [data.name, data.dept, data.entry], function(err, rows, result) {
    
        if(err){
            console.log('Error: ' + err);
        }
        return query_res("select * from students", res);
    
    });

});

// COURSES. POST Req will add.
router.post('/api/courses', function(req, res) {

    // Grab data from http request
    var data = {name: req.body.name, dept: req.body.dept, code: req.body.code};
    query("INSERT INTO courses(name, dept, code) values($1, $2, $3)", [data.name, data.dept, data.code], function(err, rows, result) {
    
        if(err){
            console.log('Error: ' + err);
        }
        return query_res("select * from courses", res);
    
    });

});

//update faculty 
router.put('/api/faculty/:faculty_id', function(req, res) {

    // Grab data from the URL parameters
    var id = req.params.faculty_id;

    // Grab data from http request
    var data = {name: req.body.name, dept: req.body.dept};

    query("UPDATE faculty SET name=($1), dept=($2) WHERE id=($3)", [data.name, data.dept, id], function(err, rows, result) {
    
        if(err){
            console.log('Error: ' + err);
        }
        return query_res("select * from faculty", res);
    
    });

});

//update students 
router.put('/api/students/:students_id', function(req, res) {

    // Grab data from the URL parameters
    var id = req.params.students_id;

    // Grab data from http request
    var data = {name: req.body.name, dept: req.body.dept, entry:req.body.entry};

    query("UPDATE students SET name=($1), dept=($2), entry=($3) WHERE id=($4)", [data.name, data.dept, data.entry, id], function(err, rows, result) {
    
        if(err){
            console.log('Error: ' + err);
        }
        return query_res("select * from students", res);
    
    });

});

//update courses 
router.put('/api/courses/:courses_id', function(req, res) {

    // Grab data from the URL parameters
    var id = req.params.courses_id;

    // Grab data from http request
    var data = {name: req.body.name, dept: req.body.dept, code: req.body.code};

    query("UPDATE courses SET name=($1), dept=($2), code=($3) WHERE id=($4)", [data.name, data.dept, data.code, id], function(err, rows, result) {
    
        if(err){
            console.log('Error: ' + err);
        }
        return query_res("select * from courses", res);
    
    });

});

//delete from faculty
router.delete('/api/faculty/:faculty_id', function(req, res) {

    // Grab data from the URL parameters
    var id = req.params.faculty_id;

    query("DELETE FROM faculty WHERE id=($1)", [id], function(err, rows, result) {
    
        if(err){
            console.log('Error: ' + err);
        }
        return query_res("select * from faculty", res);
    
    });

});

//delete from students
router.delete('/api/students/:students_id', function(req, res) {

    // Grab data from the URL parameters
    var id = req.params.students_id;

    query("DELETE FROM students WHERE id=($1)", [id], function(err, rows, result) {
    
        if(err){
            console.log('Error: ' + err);
        }
        return query_res("select * from students", res);
    
    });

});

//delete from courses
router.delete('/api/courses/:courses_id', function(req, res) {

    // Grab data from the URL parameters
    var id = req.params.courses_id;

    query("DELETE FROM courses WHERE id=($1)", [id], function(err, rows, result) {
    
        if(err){
            console.log('Error: ' + err);
        }
        return query_res("select * from courses", res);
    
    });

});

module.exports = router;
