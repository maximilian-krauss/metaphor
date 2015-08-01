module.exports = function() {
  var app = this.app;

  app.get('/heartbeat', function(req, res) {
    res.status(200).send({
      service: 'up and running',
      mood: 'tipsy'
    });
  });
};
