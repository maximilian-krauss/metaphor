'use strict'

var _ = require('lodash'),
    Q = require('q'),
    request = require('request'),
    pattern = /^https?:\/\/(www.|)soundcloud.com\/([^\?&\"\'>]+)$/,
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
      return callback(err || new Error(body.errors[0].error_message));
    }

    callback(null, body);
  });
}

function _reportAndReject(kugelblitz, err, item, deferred) {
  kugelblitz.reportError(err)
    .then(() => {
      deferred.reject(item);
    });

  return deferred.promise;
}

module.exports = function(kugelblitz, item) {
  var deferred = Q.defer();

  if(!pattern.test(item.url)) {
    deferred.reject(item);
    return deferred.promise;
  }

  _fetchSoundcloudMeta(item.url, function(err, meta) {
    if(err) {
      console.log('[SOUNDCLOUD] ERROR:'.red, err.message);
      return _reportAndReject(kugelblitz, err, item, deferred);
    }

    deferred.resolve(_.extend(item, {
      type: 'soundcloud',
      resolved: true,
      meta:  _normalizeMeta(meta)
    }));
  });

  return deferred.promise;
}
