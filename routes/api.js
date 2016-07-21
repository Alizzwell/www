var multer = require('multer');

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'public/images/thumb/');
	},
	filename: function(req, file, cb) {
		cb(null, req.body.category + " - " + req.body.subject);
	}
});

var upload = multer({
	storage: storage,
	limits: {fileSize: 1024 * 1024 * 3}
}).single('thumb');

/*
result code
  0 : success
  1 : error(except below items)
  2 : subject duplicate
  3 : upload file size exceeded
  4 : 0 or 2 more items(when update)
*/

module.exports = function(app, Algorithm, Problem) {

  
  
  app.post('/api/demo/upload', function(req, res) {

	  // call python script (Async) //
	  (function when_py_done_callback() {
		  // completely created binary.
		  
		  (function when_binary_print_output() {
			  // binary print output...
			  
			  // output -> json data
			  var jsonData = {
				  targets: [
					{ name: "A", type: "integer", isArray: true, length: 6, init: [ 9, 8, 7, 6, 5, 4 ] }
				  ],
				  steps: [
          { line: 6, status: { "A": [ 9, 8, 7, 6, 5, 4 ] } },
          
          { line: 7, status: { "A": [ 9, 8, 7, 6, 5, 4 ] } },
          { line: 8, status: { "A": [ 9, 8, 7, 6, 5, 4 ] } },
          { line: 9, status: { "A": [ 8, 9, 7, 6, 5, 4 ] } },
          { line: 10, status: { "A": [ 8, 9, 7, 6, 5, 4 ] } },
          { line: 8, status: { "A": [ 8, 9, 7, 6, 5, 4 ] } },
          { line: 9, status: { "A": [ 8, 7, 9, 6, 5, 4 ] } },
          { line: 10, status: { "A": [ 8, 7, 9, 6, 5, 4 ] } },
          { line: 8, status: { "A": [ 8, 7, 9, 6, 5, 4 ] } },
          { line: 9, status: { "A": [ 8, 7, 6, 9, 5, 4 ] } },
          { line: 10, status: { "A": [ 8, 7, 6, 9, 5, 4 ] } },
          { line: 8, status: { "A": [ 8, 7, 6, 9, 5, 4 ] } },
          { line: 9, status: { "A": [ 8, 7, 6, 5, 9, 4 ] } },
          { line: 10, status: { "A": [ 8, 7, 6, 5, 9, 4 ] } },
          { line: 8, status: { "A": [ 8, 7, 6, 5, 9, 4 ] } },
          { line: 9, status: { "A": [ 8, 7, 6, 5, 4, 9 ] } },
          { line: 10, status: { "A": [ 8, 7, 6, 5, 4, 9 ] } },
          { line: 11, status: { "A": [ 8, 7, 6, 5, 4, 9 ] } },

          { line: 7, status: { "A": [ 8, 7, 6, 5, 4, 9 ] } },
          { line: 8, status: { "A": [ 8, 7, 6, 5, 4, 9 ] } },
          { line: 9, status: { "A": [ 7, 8, 6, 5, 4, 9 ] } },
          { line: 10, status: { "A": [ 7, 8, 6, 5, 4, 9 ] } },
          { line: 8, status: { "A": [ 7, 8, 6, 5, 4, 9 ] } },
          { line: 9, status: { "A": [ 7, 6, 8, 5, 4, 9 ] } },
          { line: 10, status: { "A": [ 7, 6, 8, 5, 4, 9 ] } },
          { line: 8, status: { "A": [ 7, 6, 8, 5, 4, 9 ] } },
          { line: 9, status: { "A": [ 7, 6, 5, 8, 4, 9 ] } },
          { line: 10, status: { "A": [ 7, 6, 5, 8, 4, 9 ] } },
          { line: 8, status: { "A": [ 7, 6, 5, 8, 4, 9 ] } },
          { line: 9, status: { "A": [ 7, 6, 5, 4, 8, 9 ] } },
          { line: 10, status: { "A": [ 7, 6, 5, 4, 8, 9 ] } },
          { line: 11, status: { "A": [ 7, 6, 5, 4, 8, 9 ] } },

          { line: 7, status: { "A": [ 7, 6, 5, 4, 8, 9 ] } },
          { line: 8, status: { "A": [ 7, 6, 5, 4, 8, 9 ] } },
          { line: 9, status: { "A": [ 6, 7, 5, 4, 8, 9 ] } },
          { line: 10, status: { "A": [ 6, 7, 5, 4, 8, 9 ] } },
          { line: 8, status: { "A": [ 6, 7, 5, 4, 8, 9 ] } },
          { line: 9, status: { "A": [ 6, 5, 7, 4, 8, 9 ] } },
          { line: 10, status: { "A": [ 6, 5, 7, 4, 8, 9 ] } },
          { line: 8, status: { "A": [ 6, 5, 7, 4, 8, 9 ] } },
          { line: 9, status: { "A": [ 6, 5, 4, 7, 8, 9 ] } },
          { line: 10, status: { "A": [ 6, 5, 4, 7, 8, 9 ] } },
          { line: 11, status: { "A": [ 6, 5, 4, 7, 8, 9 ] } },

          { line: 7, status: { "A": [ 6, 5, 4, 7, 8, 9 ] } },
          { line: 8, status: { "A": [ 6, 5, 4, 7, 8, 9 ] } },
          { line: 9, status: { "A": [ 5, 6, 4, 7, 8, 9 ] } },
          { line: 10, status: { "A": [ 5, 6, 4, 7, 8, 9 ] } },
          { line: 8, status: { "A": [ 5, 6, 4, 7, 8, 9 ] } },
          { line: 9, status: { "A": [ 5, 4, 6, 7, 8, 9 ] } },
          { line: 10, status: { "A": [ 5, 4, 6, 7, 8, 9 ] } },
          { line: 11, status: { "A": [ 5, 4, 6, 7, 8, 9 ] } },

          { line: 7, status: { "A": [ 5, 4, 6, 7, 8, 9 ] } },
          { line: 8, status: { "A": [ 5, 4, 6, 7, 8, 9 ] } },
          { line: 9, status: { "A": [ 4, 5, 6, 7, 8, 9 ] } },
          { line: 10, status: { "A": [ 4, 5, 6, 7, 8, 9 ] } },
          { line: 11, status: { "A": [ 4, 5, 6, 7, 8, 9 ] } },

          { line: 12, status: { "A": [ 4, 5, 6, 7, 8, 9 ] } },

          { line: 14, status: { "A": [ 4, 5, 6, 7, 8, 9 ] } }
				  ]
			  };
			  
			  res.status(201).json(jsonData);
			  
		  })();
		  
	  })();
  });
  
	// algorithms
	app.get('/api/algorithms', function(req, res) {
		Algorithm.find({}, {"category": 1, "subject": 1, "_id": 0}, function(err, data) {
		if (err)
			return res.json({"result": 1});
		else
			res.json(data);
		})
	});
  
  

	app.post('/api/algorithms', function(req, res) {
		upload(req, res, function(err) {
			if (err) {
				// upload file size exceeded
				if (err.code == "LIMIT_FILE_SIZE") {
					res.json({"result": 3});
					return;
				}
				res.json({"result": 1});
				return;
			}
			
			Algorithm.find({"subject": req.body.subject}, function(err, data) {
				if (data.length != 0) {
					res.json({"result": 2});
					return;
				}
				
				var algorithm = new Algorithm();
				algorithm.category = req.body.category;
				algorithm.subject = req.body.subject;
				algorithm.inputData = req.body.inputData;
				algorithm.code = req.body.code;
			
				algorithm.save(function(err) {
					if (err)
						res.json({"result": 1});
					else
						res.json({"result": 0});
				});
			});
		});
	});
	

	app.put('/api/algorithms/:subject', function(req, res) {
		upload(req, res, function(err) {
			// upload file size exceeded
			if (err.code == "LIMIT_FILE_SIZE") {
				res.json({"result": 3});
				return;
			}
			else if (err) {
				res.json({"result": 1});
				return;
			}
			
			Algorithm.find({subject: req.params.subject}, function(err, data) {
				if (data.length != 1) {
					res.json({"result": 4});
					return;
				}
				
				Algorithm.update({subject: req.params.subject}, {$set: req.body}, function(err, doc) {
					if (err)
						res.json({"result": 1});
					else
						res.json({"result": 0});
				});
			});
		});
	});
	

	app.delete('/api/algorithms/:subject', function(req, res) {
		Algorithm.remove({subject: req.params.subject}, function(err) {
			if (err)
				res.json({"result": 1});
			else
				res.json({"result": 0});
		});
	});
	
	
	app.get('/api/algorithms/:subject', function(req, res) {
		Algorithm.findOne({'subject': req.params.subject}, function(err, data) {
		if (err)
			res.json({"result": 1});
		else
			res.json(data);
		});
	});
	
	
	// problem
	app.get('/api/problems', function(req, res) {
	
	});
	
	
	app.get('/api/:number/:difficulty', function(req, res) {
	
	});
};
