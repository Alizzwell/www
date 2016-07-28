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


require('./routes/api')(app, Algorithm);

app.get('/', function(req, res) {
	res.render('index');
});

app.get('/main', function (req, res) {
	res.render('main');
});


var algoRoute = require('./routes/algorithms');
app.use('/algorithms', algoRoute);


// view engine setup
app.set('views', 'views');
app.set('view engine', 'ejs');

app.use(express.static('public'));


module.exports = app;
