'use strict'

const _ = require('lodash'),
    all = require('require-tree'),
    express = require('express'),
    compression = require('compression'),
    bodyParser = require('body-parser'),
    colors = require('colors'),
    dotenv = require('dotenv').config({silent: true}),
    morgan = require('morgan'),
    mk = require('meerkat-client'),
    config = require('./config.js'),
    app = express();

var controllers = all('./controllers/'),
    middlewares = all('./middlewares'),
    interceptors = all('./interceptors'),
    meerkat = new mk({
      endpoint: config.meerkat.endpoint,
      token: config.meerkat.token
    }),
    core = require('./core');

function injectDependenciesInto(targets) {
  _.each(targets, function(target) {
    target.apply({
      app: app,
      core: core,
      middlewares: middlewares,
      config: config
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
app.all('*', (req, res) => {
  res.status(404).send({ error: 'Page not found' });
});

function fireAndForget() {
  const port = process.env.PORT || 9090;

  var server = app.listen(port, () => {
    const h = server.address().address;
    const p = server.address().port;

    console.log('metaphor is up and running at http://%s:%s'.green, h, p); // Baxxter
  });
}

fireAndForget();
