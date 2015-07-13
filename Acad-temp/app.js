var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var redis = require('redis');
var session = require('express-session');
var redisStore = require('connect-redis')(session);
var app = express();

var client = redis.createClient();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
var options = {
                host:'localhost',
                port:6379,
                client:client
};

app.use(session(
            {
                secret:"secretcode",
                store:new redisStore(options),
                saveUninitialized: false,
                resave: false
            }
            ));

app.get('/login/id:value', function(req, res) {
    if (req.session.uid)
        res.send(req.session.uid + " is already logged in. ");
    else {
        req.session.uid= req.params.value;
        res.send("Session written in Redis with uid " + req.session.uid);
    }
});

app.get('/login/get', function(req, res) {
    if (req.session.uid)
        res.send('The login stored in Redis is ' + req.session.uid);
    else 
        res.send('No login stored in Redis');
    }
    );
app.get('/logout', function(req, res) {
    req.session.destroy(function() {
        console.log("Session destroyed");
    });
    res.send('Logged out');
    });

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.use(function(err, req, res, next) {
    console.log(err);
});

module.exports = app;

