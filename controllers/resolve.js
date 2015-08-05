module.exports = function() {
  var app = this.app,
      core = this.core,
      middlewares = this.middlewares;

  app.post('/resolve', function(req, res) {

    core.resolver(req.body, function(err, resolvedItems) {
      if(err) {
        return res.status(400).send({ error: err.message });
      }

      res.status(200).send(resolvedItems);
    });

  });
};
