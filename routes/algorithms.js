var http = require('http');
var router = require('express').Router();

router.get('/', function(req, res) {
  //res.send('hello');
  var options = {
    host: 'localhost',
    port: 3000,
    path: '/api/algorithms',
    method: 'GET'
  }
  http.request(options, function(data) {
    //res.send(data);
    console.log("statusCode: ", data.statusCode);
  });
  res.send('hello');
});

router.get('/:subject', function(req, res) {
  req.params.subject
});

module.exports = router;
