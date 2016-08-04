
var filenameIndex = 1;
var imagenameIndex = 1;
var tmpImagePath = 'images/tmp/';
var imagePath = 'images/thumb/';
var sourcePath = 'tmp/source_code/';
var testjsPath = 'gcc/';


var multer = require('multer');
var fs = require('fs');
var util = require('util');
var exec = require('child_process').exec;
var async = require('async');
var CronJob = require('cron').CronJob;

var job = new CronJob({
	cronTime: '0 0 0 * * *',
	onTick: function () {
		filenameIndex = 1;
		imagenameIndex = 1;
		
		var cmd = "find tmp -type f -not -name .gitignore -print0 | xargs -0 rm --";
		exec(cmd, function (err, stdout, stderr) {
			if (err) {
				console.log(err);
			}
		});
	},
	start: false,
	timeZone: 'Asia/Seoul'
});
job.start();

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "public/" + tmpImagePath);
	},
	filename: function(req, file, cb) {
		cb(null, Date.now() + '_' + file.originalname);
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

  
  
	// algorithms
	app.get('/api/algorithms', function(req, res) {
		Algorithm.find({}, { "_id": 1, "category": 1, "subject": 1, "imageURL": 1 }, function(err, data) {
		if (err)
			return res.json({"result": 1});
		else
			res.json(data);
		})
	});
  
  

	app.post('/api/image_upload', function(req, res) {
		upload(req, res, function(err) {
			if (err) {
				// upload file size exceeded
				if (err.code == "LIMIT_FILE_SIZE") {
					res.json({"result": 3});
					return;
				}
				console.log(err);
				res.json({"result": 1});
				return;
			}
			
			res.json({image_file_name: "/" + tmpImagePath + req.file.filename});
		});
	});

	app.post('/api/algorithms', function(req, res) {
		Algorithm.find({"subject": req.body.subject}, function(err, data) {
			if (data.length != 0) {
				res.json({"result": 2});
				return;
			}

			var category = req.body.category;
			var subject = req.body.subject;
			var inputData = req.body.inputData;
			var targets = req.body.targets;
			var code = req.body.code;
			var breaks = req.body.breaks;

			if (!(category && subject && code)) {
				res.json({"result": 4});
				return;
			}
			
			var algorithm = new Algorithm();
			algorithm.category = category;
			algorithm.subject = subject;
			algorithm.inputData = inputData;
			algorithm.targets = targets;
			algorithm.code = code;
			algorithm.imageURL = "";
			algorithm.breaks = breaks;
			
			if (req.body.image_file_name) {
				var img_tmp_path = req.body.image_file_name;
				
				var temp = img_tmp_path.split('.');
				var img_ext = temp[temp.length - 1];
				var img_store_path = imagePath + subject + "." + img_ext;
				algorithm.imageURL = img_store_path;

				var reader = fs.createReadStream("public/" + img_tmp_path);
				var writer = fs.createWriteStream("public/" + img_store_path);
				
				writer.on('close', function () {
					algorithm.save(function(err) {
						if (err)
							res.json({"result": 1});
						else
							res.json({"result": 0});
					});
				});
				reader.pipe(writer);
			}
			else {
				algorithm.save(function(err) {
					if (err)
						res.json({"result": 1});
					else
						res.json({"result": 0});
				});
			}
		});
	});
	
	app.put('/api/algorithms/:id', function(req, res) {		
		Algorithm.find({"_id": req.params.id}, function(err, data) {
			if (data.length != 1) {
				res.json({"result": 4});
				return;
			}
			
			Algorithm.update({"_id": req.params.id}, {$set: req.body}, function(err, doc) {
				if (err)
					res.json({"result": 1});
				else
					res.json({"result": 0});
			});
		});
	});
	
	app.delete('/api/algorithms/:id', function(req, res) {
		Algorithm.remove({"_id": req.params.id}, function(err) {
			if (err)
				res.json({"result": 1});
			else
				res.json({"result": 0});
		});
	});
	
	app.get('/api/algorithms/:id', function(req, res) {
		Algorithm.findOne({'_id': req.params.id}, function(err, data) {
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
		var code = req.body.code + "\n\n";
		var targets = req.body.targets;
		var input = req.body.input;
		var bps = req.body.bps;
		
		if (targets.length == 0 ||
			code === "") {
			res.json({"result": 1});
			return;
		}
		
		async.waterfall([
			function (cb) {
				fs.writeFile(
					sourcePath + filenameIndex + '.cpp',
					code,
					cb
				);
			},
			function (cb) {				
				fs.writeFile(
					sourcePath + filenameIndex + '.txt',
					input,
					cb
				);
			},
			function (cb) {				
				var cmd = util.format('g++ -g %s -o %s', 
					sourcePath + filenameIndex + '.cpp',
					sourcePath + filenameIndex + '.out');
					
				exec(cmd, cb);
			},
			function (stdout, stderr, cb) {				
				var cmd = util.format('node %stest.js %s %s ',
					testjsPath,
					sourcePath + filenameIndex + '.cpp',
					sourcePath + filenameIndex + '.out');
					
				cmd += '--targets ';
				for (var i in targets) {
					cmd += targets[i]
					cmd += ' ';
				}
				
				if (bps && bps.length != 0) {
					cmd += '--breaks ';
					for (var i in bps) {
						cmd += bps[i];
						cmd += ' ';
					}
				}
				
				cmd += '--input ';
				cmd += (sourcePath + filenameIndex + '.txt');
				
				exec(cmd, cb);
			},
			function (stdout, stderr, cb) {
				filenameIndex++;
				res.status(201).json({
					"code": code,
					"data": JSON.parse(stdout)
				});
			}
		], function (err) {
			if (err) {
				console.log(err);
				res.json({"result": 1});
			}
		});
	});
};
