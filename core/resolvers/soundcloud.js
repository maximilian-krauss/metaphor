var _ = require('lodash'),
    Q = require('Q'),
    request = require('request'),
    soundcloudResolveUri = 'https://api.soundcloud.com/resolve.json';

function _fetchSoundcloudMeta(url, callback) {
  var soundcloudId = process.env.META_RESOLVER_SOUNDCLOUD_CLIENT_ID;
  if(!soundcloudId) {
    return callback(new Error('No soundcloud client id provided'));
  }

  var options = {
    qs: {
      client_id: soundcloudId,
      url: url
    },
    json: true
  };

  request.get(soundcloudResolveUri, options, function(err, res, body) {
    if(err || body.errors) {
      return callback(err || body.errors[0].error_message);
    }

    callback(null, body);
  });
}

module.exports = function(item) {
  var deferred = Q.defer();

  if(!/^https?:\/\/(www.|)soundcloud.com\/([^\?&\"\'>]+)$/.test(item.url)) {
    console.log('thats not an soundcloud url');
    deferred.reject(item);
    return deferred.promise;
  }

  _fetchSoundcloudMeta(item.url, function(err, meta) {
    if(err) {
      console.log('[SOUNDCLOUD] ERROR:'.red, err.message);
      deferred.reject(item);
      return deferred.promise;
    }

    item.type = 'soundcloud';
    item.meta = meta;

    deferred.resolve(item);
  });

  return deferred.promise;
}
