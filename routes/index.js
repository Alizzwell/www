var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/temp', function(req, res, next) {
	var codes = req.db.get('codes');
	codes.find({}, {}, function(e, docs) {
		res.render('temp', {title: 'temp', codes: docs[0]});
	});
});

router.post('/temp/save', function(req, res, next) {
	var codes = req.db.get('codes');
	console.log(req.body);
	codes.update(
		{input: req.body.input},
		{$set : req.body},
		function(err, data) {
			if (err)   console.log(err);
			else       console.log('code is updated');
		}
	);
	res.send('/temp');
});

module.exports = router;
