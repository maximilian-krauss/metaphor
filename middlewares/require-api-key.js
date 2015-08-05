module.exports = function() {
  var core = this.core;

  return function(req, res, next) {
    next();
  }
};
