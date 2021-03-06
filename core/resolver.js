var _ = require('lodash'),
    all = require('require-tree'),
    Q = require('q'),
    fulfilled = 'fulfilled',
    resolvers = all('./resolvers');

function _resolve(kugelblitz, url, index) {
  var deferred = Q.defer(),
      resolverJobs = [];

  var item = {
    index: index,
    url: url,
    type: 'unknown',
    resolved: false,
    meta: undefined
  };

  _.each(resolvers, function(r) {
    resolverJobs.push(r(kugelblitz, item));
  });

  Q.any(resolverJobs)
    .then(deferred.resolve, function() {
      deferred.reject(item);
    });

  return deferred.promise;
}

module.exports = function(kugelblitz, itemsToResolve, callback) {
  var jobs = [];

  _.each(itemsToResolve, function(item, index) {
    jobs.push(_resolve(kugelblitz, item, index));
  });

  Q.allSettled(jobs)
    .then(function(results) {
      var resolvedItems = _(results)
        .chain()
        .map(function(promise) {
          return promise.state === fulfilled
            ? promise.value
            : promise.reason;
        })
        .sortBy(function(item) { return item.index; })
        .value();

      callback(null, resolvedItems);
    });
}
