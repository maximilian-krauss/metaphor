var apiKey = process.env.META_API_KEY,
    requireApiKey = process.env.META_REQUIRE_API_KEY

module.exports = function() {
  var core = this.core;

  return function(req, res, next) {
    if(apiKey
      && requireApiKey === 'true'
      && req.get('x-api-key') !== apiKey) {

      return res
        .status(401)
        .send({ error: 'No or invalid API key' });
    }

    next();
  }
};
