var _ = require('lodash'),
    Q = require('Q'),
    request = require('request'),
    soundcloudResolveUri = 'https://api.soundcloud.com/resolve.json';

function _normalizeMeta(meta) {
  return {
    id: meta.id,
    title: meta.title,
    description: meta.description,
    createdAt: meta.created_at,
    previewImage: meta.artwork_url,
    plays: meta.playback_count,
    likes: meta.favoritings_count,
    duration: meta.duration
  }
}

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
    deferred.reject(item);
    return deferred.promise;
  }

  _fetchSoundcloudMeta(item.url, function(err, meta) {
    if(err) {
      console.log('[SOUNDCLOUD] ERROR:'.red, err.message);
      deferred.reject(item);
      return deferred.promise;
    }

    deferred.resolve(_.extend(item, {
      type: 'soundcloud',
      meta:  _normalizeMeta(meta)
    }));
  });

  return deferred.promise;
}
