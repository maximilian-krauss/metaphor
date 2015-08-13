var pkg = require('../package.json');

module.exports = function() {
  var app = this.app;

  app.get('/', function(req, res) {
    res.send({
      home: pkg.homepage,
      'available-routes': {
        '/resolve': {
          post: 'Resolves meta data of one or more uris'
        }
      }
    })
  });
}
