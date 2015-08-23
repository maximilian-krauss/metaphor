var _ = require('lodash'),
    all = require('require-tree')
    express = require('express'),
    compression = require('compression'),
    bodyParser = require('body-parser'),
    colors = require('colors'),
    dotenv = require('dotenv').config({silent: true}),
    morgan = require('morgan'),
    app = express();

var controllers = all('./controllers/'),
    middlewares = all('./middlewares'),
    interceptors = all('./interceptors'),
    core = require('./core');

function injectDependenciesInto(targets) {
  _.each(targets, function(target) {
    target.apply({
      app: app,
      core: core,
      middlewares: middlewares
    })
  });
}

injectDependenciesInto(interceptors);

app.use(morgan('tiny'));
app.use(compression({ threshold: 512 }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.set('x-powered-by', false);
app.set('etag', 'strong');

injectDependenciesInto(middlewares);
injectDependenciesInto(controllers);

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
