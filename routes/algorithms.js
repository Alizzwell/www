var router = require('express').Router();

router.get('/', function(req, res) {
	res.render('algorithms/list');
});

router.get('/add', function(req, res) {
	res.render('algorithms/add');
});

router.get('/:subject', function(req, res) {
	// detail view page randering
});



module.exports = router;
