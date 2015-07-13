/* This is the file responsible for all the queries performed on the database. We have three databases
now, namely, 'instructor', 'student' and 'courses'. */


var express = require('express');
var router = express.Router();
var query = require('pg-query');
var path = require('path');
var pg = require('pg');

// --------GET instructure page which is currently our home page--------\\
router.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname,'../','views','crud.html'));
});

var conString = "postgres://postgres:postgres@localhost/academicportal";


//---------Display all records ---------------------\\
router.get('/deptmaster', function(req, res) {
    var results = [];
    pg.connect(conString, function(err, client, done) {
        var query = client.query("SELECT * FROM deptmaster ORDER BY dpid ASC ;");
        query.on('row', function(row) {
            results.push(row);
        });
        query.on('end', function() {
            client.end();
            console.log(results);
            return res.json(results);
        });
        // Handle Errors
        if(err) {
          console.log(err);
      }
  });
});


//-----------------Add a new record--------------------\\
router.post('/deptmaster/addrecord', function(req, res) {
    var results = [];
    console.log("I got the add request");
    console.log(req.body);
    var data = {id: req.body.dpid, name: req.body.deptname};
    console.log("data.id");

    pg.connect(conString, function(err, client, done) {
        client.query("INSERT INTO deptmaster(dpid,deptname) values($1, $2)", [data.id, data.name]);
        if(err) {
          console.log(err);
      }
      else{
        return res.json([]);
    }
});

});


//--------------------Delete a particular record--------------\\
router.delete('/deptmaster/:id', function(req, res) {

    var results = [];
    var id = req.params.id;
    pg.connect(conString, function(err, client, done) {
        client.query("DELETE FROM deptmaster WHERE dpid=($1)", [id]);
            // Handle Errors
            if(err) {
              console.log(err);
          }
          else{
            return res.json([]);
        }
    });

});


//-----------Get the row for a particular id------------\\
router.get('/deptmaster/:id', function(req, res){
    var results;
    var id = req.params.id;
    console.log(id);
    pg.connect(conString, function(err, client, done) {
        var query = client.query("SELECT * FROM deptmaster WHERE dpid=($1)", [id]);
        query.on('row', function(row) {
            results =row;
        });
        query.on('end', function() {
            client.end();
            return res.json(results);
        });

        if(err) {
          console.log(err);
      }
  });
});    


//-----------------------Query Records in table ---------\\
//query the table according to the id(search string) entered by user
//also takes care for the conditions like "ash*". Will find all strings starting with 'ash'
//currently searches only for the name or the department name 
router.put('/deptmaster/query', function(req, res){
    var results = [];
 //   var id = req.params.id;
//    console.log(id);
console.log("This result is from Query function");
var data = {id: req.body.id, name: req.body.name};
console.log(data);
pg.connect(conString, function(err, client, done) {
    var query = client.query("SELECT * FROM deptmaster WHERE ((deptname ILIKE $1) AND (dpid ILIKE $2))", [data.name+ '%', data.id+ '%']);
    query.on('row', function(row) {
        results.push(row);
    });
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



router.put('/coursemaster/query', function(req, res){
    var results = [];
    console.log("This is query function");
    var data = {crid: req.body.crid, dpid:req.body.dpid, coursename: req.body.coursename, credits: req.body.credits};
    console.log(data);
    pg.connect(conString, function(err, client, done) {
        if(credits = -1){
            var query = client.query("SELECT * FROM coursemaster WHERE ((crid ILIKE $1) AND (dpid ILIKE $2) AND (coursename ILIKE $3) AND (pre_req1 ILIKE $4))", [data.crid+ '%', data.dpid+ '%', data.coursename+ '%']);
        }
        else
        {
            var query = client.query("SELECT * FROM coursemaster WHERE ((crid ILIKE $1) AND (dpid ILIKE $2) AND (coursename ILIKE $3) AND credits = ($4) AND (pre_req1 ILIKE $5) )", [data.crid+ '%', data.dpid+ '%', data.coursename+ '%', data.credits]);
        }
        query.on('row', function(row) {
            results.push(row);
        });
        query.on('end', function() {
            client.end();
            console.log(results);
            return res.json(results);
        });
        // Handle Errors
        if(err) {
          console.log(err);
      }
  });
});


router.put('/students/query', function(req, res){
    var results = [];
    console.log("This is query function");
    var data = {stid: req.body.stid, name:req.body.name, dpid:req.body.dpid, year: req.body.year, degree: req.body.degree};
    console.log(data);
    pg.connect(conString, function(err, client, done){
        if(year = -1){
            var query = client.query("SELECT * FROM student WHERE ((stid ILIKE $1) AND (name ILIKE $2) AND (dpid ILIKE $3) AND (degree ILIKE $4))", [data.stid+ '%', data.name+ '%', data.dpid+ '%', data.degree+ '%']);
        }
        else
        {
            var query = client.query("SELECT * FROM student WHERE ((stid ILIKE $1) AND (name ILIKE $2) AND (dpid ILIKE $3) AND (year ILIKE $4) AND (degree ILIKE $5))", [data.stid+ '%', data.name+ '%', data.dpid+ '%', data.year, data.degree+ '%']);
        }
        query.on('row', function(row){
            results.push(row);
        });
        query.on('end', function(){
            client.end();
            console.log(results);
            return res.json(results);
        });
        if(err){
            console.log(err);
        }
    });
});

router.put('/coursesoffered/query', function(req, res){
    var results = [];
    console.log("This is query function");
    var data = {crid: req.body.crid, facid:req.body.facid, semid:req.body.semid, slotid: req.body.slotid, numseats: req.body.numseats, totalapplicants: req.body.totalapplicants, statuscode: req.body.statuscode};
    console.log(data);
    pg.connect(conString, function(err, client, done){
        var query = client.query("SELECT * FROM coursesoffered WHERE ((crid ILIKE $1) AND (facid ILIKE $2) AND (semid ILIKE $3) AND (slotid ILIKE $4) AND (numseats > $5) and (totalapplicants > $6) and (statuscode ilike $7))", [data.crid+ '%', data.facid+ '%', data.semid+ '%', data.slotid + '%', data.numseats, data.totalapplicants, data.statuscode + '%']);
        query.on('row', function(row){
            results.push(row);
        });
        query.on('end', function(){
            client.end();
            console.log(results);
            return res.json(results);
        });
        if(err){
            console.log(err);
        }
    });
});

router.put('/coursesregistered/query', function(req, res){
    var results = [];
    console.log("This is query function");
    var data = {crid: req.body.crid, stid:req.body.stid, semid:req.body.semid};
    console.log(data);
    pg.connect(conString, function(err, client, done){
        var query = client.query("SELECT * FROM coursesregistered WHERE ((crid ILIKE $1) AND (stid ILIKE $2) AND (semid ILIKE $3)", [data.crid+ '%', data.stid+ '%', data.semid+ '%']);
        query.on('row', function(row){
            results.push(row);
        });
        query.on('end', function(){
            client.end();
            console.log(results);
            return res.json(results);
        });
        if(err){
            console.log(err);
        }
    });
});

router.put('/faculty/query', function(req, res){
    var results = [];
    console.log("This is query function");
    var data = {fcid: req.body.fcid, name:req.body.name, title:req.body.title, dpid:req.body.dpid, emailid:req.body.emailid, contactno:req.body.contactno,areas:req.body.areas};
    console.log(data);
    pg.connect(conString, function(err, client, done) {
        var query = client.query("SELECT * FROM faculty WHERE ((name ILIKE $1) AND (fcid ILIKE $2) AND (title ILIKE $3) AND (dpid ILIKE $4) AND (emailid ILIKE $5) AND (contactno ILIKE $6) AND (areas ILIKE $7))", [data.name+ '%', data.fcid+ '%', data.title+ '%',data.dpid +'%',data.emailid+ '%',data.contactno+ '%', data.areas+ '%']);
        query.on('row', function(row) {
            results.push(row);
        });
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
//---------------------Update the record --------------\\
router.put('/deptmaster/:id', function (req, res) {
  var id = req.params.id;
  var results = [];

  var data = {id: req.body.dpid, name: req.body.deptname};

  pg.connect(conString, function(err, client, done) {
    client.query("UPDATE deptmaster SET deptname=($2) WHERE dpid=($1)", [data.id, data.name]);

    if(err) {
      console.log(err);
  }
  else{
    return res.json([]);
}
});


});


//=================================FOR STUDENT RECORDS!!!!=================================\\

//-----------------Add a new record--------------------\\
router.post('/coursemaster/addrecord', function(req, res) {
    var results = [];
    console.log("I got the add request");
    console.log(req.body);
    var data = {crid: req.body.crid, coursename: req.body.coursename, dpid: req.body.dpid, credits: req.body.credits, pre_req1: req.body.pre_req1, pre_req2: req.body.pre_req2, pre_req3: req.body.pre_req3, pre_req4: req.body.pre_req4};
    console.log(data);

    pg.connect(conString, function(err, client, done) {
        client.query("INSERT INTO coursemaster(crid, dpid, credits,coursename, pre_req1, pre_req2, pre_req3, pre_req4) values($1, $2, $3, $4, $5, $6, $7, $8)", [data.crid, data.dpid, data.credits ,data.coursename, data.pre_req1, data.pre_req2, data.pre_req3, data.pre_req4]);
        if(err) {
          console.log(err);
      }
      else{
        return res.json([]);
    }
});

});

//---------Display all records ---------------------\\
router.get('/coursemaster/all', function(req, res) {
    var results = [];
    pg.connect(conString, function(err, client, done) {
        var query = client.query("SELECT * FROM coursemaster ORDER BY crid ASC ;");
        query.on('row', function(row) {
            results.push(row);
        });
        query.on('end', function() {
            client.end();
            console.log(results);
            return res.json(results);
        });
        // Handle Errors
        if(err) {
          console.log(err);
      }
  });
});

//-----------Get the row for a particular id------------\\
router.get('/coursemaster/:id', function(req, res){
    var results;
    var id = req.params.id;
    console.log(id);
    pg.connect(conString, function(err, client, done) {
        var query = client.query("SELECT * FROM coursemaster WHERE crid=($1)", [id]);
        query.on('row', function(row) {
            results =row;
        });
        query.on('end', function() {
            client.end();
            return res.json(results);
        });

        if(err) {
          console.log(err);
      }
  });
});    

//---------------------Update the record --------------\\
router.put('/coursemaster/:id', function (req, res) {
  var id = req.params.id;
  console.log(id);
  var results = [];
  var data = {coursename: req.body.coursename, dpid: req.body.dpid, credits: req.body.credits, pre_req1: req.body.pre_req1, pre_req2: req.body.pre_req2, pre_req3: req.body.pre_req3, pre_req4: req.body.pre_req4};

  pg.connect(conString, function(err, client, done) {
    client.query("UPDATE coursemaster SET dpid=($2), credits = ($3), coursename= ($4) , pre_req1 = ($5), pre_req2 = ($6)  , pre_req3 = ($7), pre_req4 = ($8) WHERE crid=($1)", [id, data.dpid, data.credits ,data.coursename, data.pre_req1, data.pre_req2, data.pre_req3, data.pre_req4]);

    if(err) {
      console.log(err);
  }
  else{
    return res.json([]);
}
});


});

router.delete('/coursemaster/:id', function(req, res) {

    var results = [];
    var id = req.params.id;
    pg.connect(conString, function(err, client, done) {
        client.query("DELETE FROM coursemaster WHERE crid=($1)", [id]);
        console.log("Hey the record is deleted");
            // Handle Errors
            if(err) {
              console.log(err);
          }
          else{
            return res.json([]);
        }
    });

});


//=================================FOR COURSE RECORDS!!!!=================================\\

//-----------------Add a new record--------------------\\
router.post('/students/addrecord', function(req, res) {
    var results = [];
    console.log("I got the add request");
    console.log(req.body);
    var data = {stid: req.body.stid, name: req.body.name, dpid: req.body.dpid, year: req.body.year, degree: req.body.degree, address: req.body.address, emailid: req.body.emailid, contactno: req.body.contactno};
    console.log(data.courseid);

    pg.connect(conString, function(err, client, done) {
        client.query("INSERT INTO student(stid, name, dpid, year, degree, address, emailid, contactno) values($1, $2, $3, $4, $5, $6, $7, $8)", [data.stid, data.name, data.dpid, data.year, data.degree, data.address, data.emailid, data.contactno]);
        if(err) {
          console.log(err);
      }
      else{
        return res.json([]);
    }
});

});

//---------Display all records ---------------------\\
router.get('/students/all', function(req, res) {
    var results = [];
    pg.connect(conString, function(err, client, done) {
        var query = client.query("SELECT * FROM student ORDER BY name ASC ;");
        query.on('row', function(row) {
            results.push(row);
        });
        query.on('end', function() {
            client.end();
            console.log(results);
            return res.json(results);
        });
        // Handle Errors
        if(err) {
          console.log(err);
      }
  });
});

//-----------Get the row for a particular id------------\\
router.get('/students/:id', function(req, res){
    var results;
    var id = req.params.id;
    console.log(id);
    pg.connect(conString, function(err, client, done) {
        var query = client.query("SELECT * FROM student WHERE stid=($1)", [id]);
        query.on('row', function(row) {
            results =row;
        });
        query.on('end', function() {
            client.end();
            return res.json(results);
        });

        if(err) {
          console.log(err);
      }
  });
});    

//---------------------Update the record --------------\\
router.put('/students/:id', function (req, res) {
  var id = req.params.id;
  console.log(id);
  var results = [];

  var data = {stid: req.body.stid, name: req.body.name, dpid: req.body.dpid, year: req.body.year, degree: req.body.degree, address: req.body.address, emailid: req.body.emailid, contactno: req.body.contactno};

  pg.connect(conString, function(err, client, done) {
    client.query("UPDATE student SET name=($2), dpid=($3), year=($4), degree=($5), address = ($6), emailid = ($7), contactno = ($8) WHERE stid=($1)", [id, data.name, data.dpid, data.year, data.degree, data.address, data.emailid, data.contactno]);

    if(err) {
      console.log(err);
  }
  else{
    return res.json([]);
}
});


});

router.delete('/students/:id', function(req, res) {

    var results = [];
    var id = req.params.id;
    pg.connect(conString, function(err, client, done) {
        client.query("DELETE FROM student WHERE stid=($1)", [id]);
        console.log("Hey the record is deleted");
            // Handle Errors
            if(err) {
              console.log(err);
          }
          else{
            return res.json([]);
        }
    });

});

//=================================FOR FACULTY RECORDS!!!!=================================\\

//-----------------Add a new record--------------------\\
router.post('/faculty/addrecord', function(req, res) {
    var results = [];
    console.log("I got the add request");
    console.log(req.body);
    var data = {fcid: req.body.fcid, name:req.body.name, title:req.body.title, dpid:req.body.dpid, emailid:req.body.emailid, contactno:req.body.contactno,areas:req.body.areas};
    console.log(data.fcid);

    pg.connect(conString, function(err, client, done) {
        client.query("INSERT INTO faculty(fcid, name, title,dpid,emailid,contactno,areas) values($1, $2, $3, $4,$5,$6,$7)", [data.fcid, data.name, data.title ,data.dpid,data.emailid, data.contactno,data.areas]);
        if(err) {
          console.log(err);
      }
      else{
        return res.json([]);
    }
});

});

//---------Display all records ---------------------\\
router.get('/faculty/all', function(req, res) {
    var results = [];
    pg.connect(conString, function(err, client, done) {
        var query = client.query("SELECT * FROM faculty ORDER BY name ASC ;");
        query.on('row', function(row) {
            results.push(row);
        });
        query.on('end', function() {
            client.end();
            console.log(results);
            return res.json(results);
        });
        // Handle Errors
        if(err) {
          console.log(err);
      }
  });
});

//-----------Get the row for a particular id------------\\
router.get('/faculty/:id', function(req, res){
    var results;
    var id = req.params.id;
    console.log(id);
    pg.connect(conString, function(err, client, done) {
        var query = client.query("SELECT * FROM faculty WHERE fcid=($1)", [id]);
        query.on('row', function(row) {
            results =row;
        });
        query.on('end', function() {
            client.end();
            return res.json(results);
        });

        if(err) {
          console.log(err);
      }
  });
});    




//---------------------Update the record --------------\\
router.put('/deptmaster/:id', function (req, res) {
  var id = req.params.id;
  var results = [];

  var data = {id: req.body.dpid, name: req.body.deptname};

  pg.connect(conString, function(err, client, done) {
    client.query("UPDATE deptmaster SET deptname=($2) WHERE dpid=($1)", [data.id, data.name]);

    if(err) {
      console.log(err);
  }
  else{
    return res.json([]);
}
});


});
//---------------------Update the record --------------\\
router.put('/faculty/:id', function (req, res) {
  var id = req.params.id;
  console.log(id);
  var results = [];

  var data = {fcid: req.body.fcid, name:req.body.name, title:req.body.title, dpid:req.body.dpid, emailid:req.body.emailid, contactno:req.body.contactno,areas:req.body.areas};
  

  pg.connect(conString, function(err, client, done) {
    client.query("UPDATE faculty SET name=($2), title=($3),dpid =($4),emailid=($5),contactno =($6), areas=($7) WHERE fcid=($1)", [id, data.name, data.title, data.dpid,data.emailid,data.contactno,data.areas]);

    if(err) {
      console.log(err);
  }
  else{
    return res.json([]);
}
});

});

//-----------------Add a new record--------------------\\
router.post('/coursesoffered/addrecord', function(req, res) {
    var results = [];
    console.log("I got the add request");
    console.log(req.body);
    var data = {crid: req.body.crid, facid: req.body.facid, semid: req.body.semid, slotid: req.body.slotid, numseats: req.body.numseats, totalapplicants: req.body.totalapplicants, statuscode: req.body.statuscode};
    console.log(data);

    pg.connect(conString, function(err, client, done) {
        client.query("INSERT INTO coursesoffered(crid, facid, semid, slotid, numseats, totalapplicants, statuscode) values($1, $2, $3, $4, $5, $6, $7)", [data.crid, data.facid, data.semid, data.slotid, data.numseats, data.totalapplicants, data.statuscode]);
        if(err) {
          console.log(err);
      }
      else{
        return res.json([]);
    }
});

});

//---------Display all records ---------------------\\
router.get('/coursesoffered/all', function(req, res) {
    var results = [];
    pg.connect(conString, function(err, client, done) {
        var query = client.query("SELECT * FROM coursesoffered ORDER BY crid ASC ;");
        query.on('row', function(row) {
            results.push(row);
        });
        query.on('end', function() {
            client.end();
            console.log(results);
            return res.json(results);
        });
        // Handle Errors
        if(err) {
          console.log(err);
      }
  });
});

//-----------Get the row for a particular id------------\\
router.get('/coursesoffered/:crid/:facid/:semid', function(req, res){
    var results;
    var crid = req.params.crid;
    var facid = req.params.facid;
    var semid = req.params.semid;
    console.log(crid);
    pg.connect(conString, function(err, client, done) {
        var query = client.query("SELECT * FROM coursesoffered WHERE crid=($1) and facid=($2) and semid=($3)", [crid,facid,semid]);
        query.on('row', function(row) {
            results =row;
        });
        query.on('end', function() {
            client.end();
            return res.json(results);
        });

        if(err) {
          console.log(err);
      }
  });
});    

//---------------------Update the record --------------\\
router.put('/coursesoffered/:crid/:facid/:semid', function (req, res) {
  var results = [];
  //console.log(req);

  var data = {crid: req.body.crid, facid: req.body.facid, semid: req.body.semid, slotid: req.body.slotid, numseats: req.body.numseats, totalapplicants: req.body.totalapplicants, statuscode: req.body.statuscode};
  console.log(data);

  pg.connect(conString, function(err, client, done) {
    client.query("UPDATE coursesoffered SET slotid=($4), numseats=($5), totalapplicants = ($6), statuscode = ($7) WHERE crid=($1) and facid=($2) and semid=($3)", [data.crid, data.facid, data.semid, data.slotid, data.numseats, data.totalapplicants, data.statuscode]);

    if(err) {
      console.log(err);
  }
  else{
    return res.json([]);
}
});


});

router.delete('/coursesoffered/:crid/:facid/:semid', function(req, res) {

    var results = [];
    var crid = req.params.crid;
    var facid = req.params.facid;
    var semid = req.params.semid;
    console.log(crid);
    pg.connect(conString, function(err, client, done) {
        client.query("DELETE FROM coursesoffered WHERE crid=($1) and facid=($2) and semid=($3)", [crid, facid, semid]);
        console.log("Hey the record is deleted");
            // Handle Errors
            if(err) {
              console.log(err);
          }
          else{
            return res.json([]);
        }
    });

});

//-----------------Add a new record--------------------\\
router.post('/coursesregistered/addrecord', function(req, res) {
    var results = [];
    console.log("I got the add request");
    console.log(req.body);
    var data = {crid: req.body.crid, stid: req.body.stid, semid: req.body.semid};
    console.log(data);

    pg.connect(conString, function(err, client, done) {
        client.query("INSERT INTO coursesregistered(crid, stid, semid) values($1, $2, $3)", [data.crid, data.stid, data.semid]);
        client.query("update coursesoffered set totalapplicants=(totalapplicants+1) where crid=($1) and semid=($2)", [data.crid, data.semid]);
        if(err) {
          console.log(err);
      }
      else{
        return res.json([]);
    }
});
    /*pg.connect(conString, function(err, client, done) {
        client.query("update coursesoffered set totalapplicants=(totalapplicants+1) where crid=($1) and semid=($3)", [data.crid, data.stid, data.semid]);
        if(err) {
          console.log(err);
      }
      else{
        return res.json([]);
    }*/


});

//---------Display all records ---------------------\\
router.get('/coursesregistered/all', function(req, res) {
    var results = [];
    pg.connect(conString, function(err, client, done) {
        var query = client.query("SELECT * FROM coursesregistered ORDER BY crid ASC ;");
        query.on('row', function(row) {
            results.push(row);
        });
        query.on('end', function() {
            client.end();
            console.log(results);
            return res.json(results);
        });
        // Handle Errors
        if(err) {
          console.log(err);
      }
  });
});

//-----------Get the row for a particular id------------\\
router.get('/coursesregistered/:crid/:stid/:semid', function(req, res){
    var results;
    var crid = req.params.crid;
    var stid = req.params.stid;
    var semid = req.params.semid;
    console.log(crid);
    pg.connect(conString, function(err, client, done) {
        var query = client.query("SELECT * FROM coursesregistered WHERE crid=($1) and stid=($2) and semid=($3)", [crid,stid,semid]);
        query.on('row', function(row) {
            results =row;
        });
        query.on('end', function() {
            client.end();
            return res.json(results);
        });

        if(err) {
          console.log(err);
      }
  });
});    

//---------------------Update the record --------------\\
router.put('/coursesregistered/:crid/:stid/:semid', function (req, res) {
  var results = [];
  //console.log(req);

  var data = {crid: req.body.crid, stid: req.body.stid, semid: req.body.semid};
  console.log(data);

  pg.connect(conString, function(err, client, done) {
    //client.query("UPDATE coursesregistered SET slotid=($4), numseats=($5), totalapplicants = ($6), statuscode = ($7) WHERE crid=($1) and facid=($2) and semid=($3)", [data.crid, data.facid, data.semid, data.slotid, data.numseats, data.totalapplicants, data.statuscode]);

    if(err) {
      console.log(err);
  }
  else{
    return res.json([]);
}
});


});

router.delete('/coursesregistered/:crid/:stid/:semid', function(req, res) {

    var results = [];
    var crid = req.params.crid;
    var stid = req.params.stid;
    var semid = req.params.semid;
    console.log(crid);
    pg.connect(conString, function(err, client, done) {
        client.query("DELETE FROM coursesregistered WHERE crid=($1) and stid=($2) and semid=($3)", [crid, stid, semid]);
        client.query("update coursesoffered set totalapplicants = totalapplicants-1 WHERE crid=($1) and semid=($2)", [crid, semid]);
        console.log("Hey the record is deleted");
            // Handle Errors
            if(err) {
              console.log(err);
          }
          else{
            return res.json([]);
        }
    });
    /*
    pg.connect(conString, function(err, client, done) {
        client.query("update coursesoffered set totalapplicants = totalapplicants-1 WHERE crid=($1) and semid=($2)", [crid, semid]);
        console.log("Hey the record is deleted");
            // Handle Errors
            if(err) {
              console.log(err);
          }
          else{
            return res.json([]);
        }
    });*/

});

module.exports = router;
