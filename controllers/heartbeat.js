var git = require('git-rev');

module.exports = function() {
  var app = this.app,
      middlewares = this.middlewares;

  app.get('/heartbeat', function(req, res) {
    git.long(function(sha) {
      res.status(200).send({
        service: 'up and running',
        commit: sha,
        mood: 'tipsy'
      });
    });
  });
};
