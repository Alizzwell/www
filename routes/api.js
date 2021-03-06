module.exports = function(app, Algorithm, Problem) {
  // algorithms
  app.get('/api/algorithms', function(req, res) {
    Algorithm.find({}, {"category":1, "subject": 1, "_id": 0}, function(err, data) {
      if (err)
        return res.json({"result": 0});
      else
        res.json(data);
    })
  });

  app.post('/api/algorithms', function(req, res) {
    var algorithm = new Algorithm();
    algorithm.category = req.body.category;
    algorithm.subject = req.body.subject;
    algorithm.inputData = req.body.inputData;
    algorithm.code = req.body.code;

    algorithm.save(function(err) {
      if (err)
        res.json({"result": 0});
      else
        res.json({"result": 1});
    });
  });

  app.put('/api/algorithms/:subject', function(req, res) {
    Algorithm.update({subject: req.params.subject}, {$set: req.body}, function(err, doc) {
      if (err)
        res.json({"result": 0});
      else
        res.json({"result": 1});
    });
  });

  app.delete('/api/algorithms/:subject', function(req, res) {
    Algorithm.remove({subject: req.params.subject}, function(err) {
      if (err)
        res.json({"result": 0});
      else
        res.json({"result": 1});
    });
  });

  app.get('/api/algorithms/:subject', function(req, res) {
    Algorithm.findOne({'subject': req.params.subject}, function(err, data) {
      if (err)
        return res.json({"result": 0});
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
