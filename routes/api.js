var multer = require('multer');
var fs = require('fs');
var util = require('util');
var exec = require('child_process').exec;

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

var filenameIndex = 1;
var sourcePath = 'tmp/source code/';
var testjsPath = 'public/code/';

module.exports = function(app, Algorithm) {

	
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
	
	

	/*
	코드 업로드 & 실행 & json으로 response
	*/
	app.post('/api/execute', function(req, res) {
		upload(req, res, function(err) {
			if (req.body.targets.length == 0 ||
				req.body.code === "" ||
				req.body.input === "") {
				res.json({"result": 1});
				return;
			}
			
			fs.writeFile(
				sourcePath + filenameIndex + '.cpp',
				req.body.code,
				function (err) {
					if (err) {
						res.json({"result": 1});
						return;
					}
					
					fs.writeFile(
						sourcePath + filenameIndex + '.txt',
						req.body.input,
						function(err) {
							if (err) {
								res.json({"result": 1});
								return;
							}
							
							// g++ 실행, 에러 처리
							var cmd = util.format('g++ %s -o %s', 
								sourcePath + filenameIndex + '.cpp',
								sourcePath + filenameIndex + '.out');
							exec(cmd, function(err, stdout, stderr) {
								if (err) {
									res.json({"result": 1});
									return;
								}
								
								// test.js 실행
								var cmd = util.format('node %stest.js %s %s ',
									testjsPath,
									sourcePath + filenameIndex + '.cpp',
									sourcePath + filenameIndex + '.out');
								
								cmd += '--targets ';
								for (var i in req.body.targets) {
									cmd += req.body.targets[i]
									cmd += ' ';
								}
								
								if (req.body.bps.length != 0) {
									cmd += '--breaks ';
									for (var i in req.body.bps) {
										cmd += req.body.bps[i];
										cmd += ' ';
									}
								}
								
								cmd += '--input ';
								cmd += (sourcePath + filenameIndex + '.txt');
								
								exec(cmd, function(err, stdout, stderr) {
									if (err) {
										res.json({"result": 1});
										return;
									}
									
									filenameIndex++;
									res.json(stdout);
								});
							});
						});
				});
		});
	});
};
