var router = require('express').Router();

router.get('/', function(req, res) {
	res.render('algorithms/list');
});

router.get('/add', function(req, res) {
	res.render('algorithms/add');
});

router.get('/:id', function(req, res) {
	var id = req.params.id;
	res.render('algorithms/view', { "id": id });
	// detail view page randering
});



module.exports = router;
