module.exports = function(app, Algorithm, Problem) {
  app.get('/api/algorithms', function(req, res) {
    Algorithm.find(function(err, data) {
      if (err)
        return res.status(500).send({error: 'db failure'});
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
      if (err) {
        console.error(err);
        res.json({result: 'db save failed'});
      }
      res.json({result: 'db save success'});
    });

    //res.redirect('/algorithms');
  });
  app.put('/api/algorithms/:subject', function(req, res) {
    Algorithm.update({subject: req.params.subject}, {$set: req.body}, function(err, doc) {
      if (err)
        res.send(500, {error: err});
      res.redirect('/algorithms/' + res.params.subject);
    });
  });
  app.delete('/api/algorithms/:subject', function(req, res) {
    Algorithm.remove({subject: req.params.subject}, function(err) {
      if (err)
        res.send(500, {error: err});
      res.redirect('/algorithms');
    });
  });
  app.get('/api/algorithms/:subject', function(req, res) {
    Algorithm.findOne({'subject': req.params.subject}, function(err, data) {
      if (err)
        return res.status(500).send({error: 'db failure'});
      res.json(data);
    });
  });

  // app.get('/api/problems', function(req, res) {
  //
  // });
  //
  // app.get('/api/:number/:difficulty', function(req, res) {
  //
  // });
};
