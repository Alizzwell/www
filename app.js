//var path = require('path');
//var favicon = require('serve-favicon');
//var logger = require('morgan');
//var cookieParser = require('cookie-parser');
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();

// mongoose
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function() {
	console.log("connected to mongod server");
});
mongoose.connect('mongodb://localhost/www');

// body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// routing
var Algorithm = require('./models/algorithm');
//var Problem = require('./models/problem');

var algoRoute = require('./routes/algorithms');
require('./routes/api')(app, Algorithm);
app.use('/algorithms', algoRoute);
app.get('/', function(req, res) {
	res.render('index');
});

// view engine setup
app.set('views', 'views');
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
//app.use(cookieParser());
app.use(express.static('public'));
app.use(express.static('tmp'));


// catch 404 and forward to error handler
//app.use(function(req, res, next) {
//  var err = new Error('Not Found');
//  err.status = 404;
//  next(err);
//});

// error handlers

// development error handler
// will print stacktrace
//if (app.get('env') === 'development') {
//  app.use(function(err, req, res, next) {
//    res.status(err.status || 500);
//    res.render('error', {
//      message: err.message,
//      error: err
//    });
//  });
//}

// production error handler
// no stacktraces leaked to user
//app.use(function(err, req, res, next) {
//  res.status(err.status || 500);
//  res.render('error', {
//    message: err.message,
//    error: {}
//  });
//});


module.exports = app;
