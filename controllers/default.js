var pkg = require('../package.json');

module.exports = function() {
  var app = this.app;

  app.get('/', function(req, res) {
    res.redirect(302, pkg.homepage);
  });
}
