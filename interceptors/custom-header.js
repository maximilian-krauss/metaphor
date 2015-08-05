module.exports = function() {
  var app = this.app;

  app.use(function(req, res, next) {
    res.set('X-Krauss-Ping', 'Pong');
    next();
  });
}
