module.exports = function() {
  var app = this.app,
      middlewares = this.middlewares;

  app.get('/heartbeat', function(req, res) {
    res.status(200).send({
      service: 'up and running',
      mood: 'tipsy'
    });
  });
};
