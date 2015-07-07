var pg = require('pg');
var username = 'postgres';
var password = 'postgres';
var host = 'localhost';
var port ='5432';
var dbname = 'academicportal';

var conStringPri = 'postgres://' + username +":" + password +'@'+host+':'+port+'/' +dbname;
var conn = process.env.DATABASE_URL || conStringPri;

var client = new pg.Client(conn);
client.connect();
var query = [];
query1 =[client.query('CREATE TABLE deptmaster(dpid VARCHAR(20) PRIMARY KEY not null,deptname VARCHAR(50))'),
				client.query('CREATE TABLE coursemaster(crid VARCHAR(20) PRIMARY KEY not null, dpid VARCHAR(20) REFERENCES deptmaster(dpid),coursename VARCHAR(50),credits varchar(50),pre_req1 varchar(50), pre_req2 varchar(50), pre_req3 varchar(50), pre_req4 varchar(50) )'),			
				client.query('CREATE TABLE faculty(fcid VARCHAR(20) PRIMARY KEY not null, name VARCHAR(50),  title VARCHAR(20), dpid VARCHAR(20) REFERENCES deptmaster(dpid), emailid varchar(50),  areas varchar(50), contactno VARCHAR(50) )'),
				client.query('CREATE TABLE student(stid VARCHAR(20) PRIMARY KEY not null, name VARCHAR(50), dpid VARCHAR(20) REFERENCES deptmaster(dpid),  year VARCHAR(20),  degree VARCHAR(20),  address varchar(50),  emailid varchar(50),  contactno VARCHAR(50) )'),
				];

for(var i = 0; i < query1.length; i++){
	var query = query1[i];
	query.on('end',function(){
		console.log(i);

	})
}

