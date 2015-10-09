module.exports = function() {
  var app = this.app,
      core = this.core,
      middlewares = this.middlewares,
      kugelblitz = this.kugelblitz;

  app.post('/resolve', middlewares['require-api-key'](), function(req, res) {

    core.resolver(kugelblitz, req.body, function(err, resolvedItems) {
      if(err) {
        return res.status(400).send({ error: err.message });
      }

      res.status(200).send(resolvedItems);
    });

  });
};
