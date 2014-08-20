var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var parser = require('./routes/parser');
var config = require('./config');
// var persistence = require('persistencejs');
// var persistenceStore = persistence.StoreConfig.init(persistence, { adaptor: 'mysql' });


var app = express();

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : config.host,
  user     : config.user,
  password : config.password
});

connection.connect(function(err) {
  if (err) {
    console.error('Error connecting to MySQL service: ' + err.stack);
    return;
  }
});

connection.query('CREATE DATABASE ' + config.database, function(err, rows) {
  if(err){
    console.log(err);
  }else{
    console.log('default database created');
  }
  
});

connection.end();

// persistenceStore.config(persistence, config.host, 3306, config.database, config.user, config.password);
// var session = persistenceStore.getSession();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/', parser);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

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


module.exports = app;
// module.exports.session = session;
