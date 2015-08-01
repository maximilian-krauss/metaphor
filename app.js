var _ = require('lodash'),
    all = require('require-tree')
    express = require('express'),
    compression = require('compression'),
    colors = require('colors'),
    app = express();

var controllers = all('./controllers/'),
    core = require('./core');

app.use(compression({ threshold: 512 }));

_.each(controllers, function(controller) {
  controller.apply({
    app: app,
    core: core
  });
});

// Catch all requests which were not handled by the controller family ... these suckers...
app.all('*', function(req, res) {
  res.status(404).send({ error: 'Page not found' });
});

function fireAndForget() {
  var port = process.env.PORT || 9090;

  var server = app.listen(port, function() {
    var h = server.address().address;
    var p = server.address().port;

    console.log('metaphor is up and running at http://%s:%s'.green, h, p); // Baxxter
  });
}

fireAndForget();
