var _ = require('lodash'),
    Q = require('q'),
    request = require('request'),
    cache = require('memory-cache'),
    clientId = process.env.META_RESOLVER_SPOTIFY_CLIENT_ID,
    clientSecret = process.env.META_RESOLVER_SPOTIFY_CLIENT_SECRET,
    authEndpoint = 'https://accounts.spotify.com/api/token',
    playlistEndpoint = 'https://api.spotify.com/v1/users/(user_id)/playlists/(playlist_id)',
    pattern = /https:\/\/open.spotify.com\/user\/([a-z,A-B,0-9,_-]+)\/playlist\/([a-z,A-Z,0-9]+)/ig;

function _extractDetailsFrom(url) {
  var match, user, playlist;
  pattern.lastIndex = 0;

  while (match = pattern.exec(url)) {
    user = match[1];
    playlist = match[2];
  }

  return {
    user: user,
    playlist: playlist
  }
}

function _getAccessToken(cb) {
  var token = cache.get('spotify-token');
  if(token) {
    return cb(null, token);
  }

  var options = {
    url: authEndpoint,
    method: 'POST',
    auth: {
      username: clientId,
      password: clientSecret
    },
    form: {
      grant_type: 'client_credentials'
    },
    json: true
  };

  request.post(options, function(err, res, body) {
    if(err || res.statusCode != 200) {
      return cb(err || new Error(JSON.stringify(body)));
    }

    cache.put('spotify-token', body.access_token, body.expires_in * 1000);
    cb(null, body.access_token);
  });
}

function _fetchSpotifyMeta(req, token, cb) {
  var options = {
    method: 'GET',
    json: true,
    auth: {
      bearer: token,
    },
    url: playlistEndpoint
      .replace('(user_id)', req.user)
      .replace('(playlist_id)', req.playlist)
  };

  request(options, function(err, res, body) {
    if(err || res.statusCode != 200) {
      return cb(err || new Error(JSON.stringify(body)));
    }
    cb(null, body);
  });
}

function _andReject(deferred, err) {
  deferred.reject(err);
  return deferred.promise;
}

function _reportAndReject(kugelblitz, err, item, deferred) {
  kugelblitz.reportError(err)
    .then(() => {
      deferred.reject(item);
    });

  return deferred.promise;
}

function _getDuration(meta) {
  return _(meta.tracks.items)
    .chain()
    .map(function(t) { return t.track.duration_ms; })
    .sum()
    .value();
}

function _normalizeMeta(meta) {
  return {
    id: meta.id,
    title: meta.name,
    description: meta.description,
    createdAt: null,
    previewImage: _(meta.images)
      .chain()
      .sortBy(function(t) { return t.width || 0; })
      .map(function(t) { return t.url; })
      .last()
      .value(),
    plays: null,
    likes: meta.followers.total,
    duration: _getDuration(meta)
  }
}

module.exports = function(kugelblitz, item) {
  var deferred = Q.defer(),
      req;

  if(!pattern.test(item.url)) {
    return _andReject(deferred, item);
  }

  req = _extractDetailsFrom(item.url);

  _getAccessToken(function(tokenErr, token) {
    if(tokenErr) {
      return _reportAndReject(kugelblitz, tokenErr, item, deferred);
    }

    _fetchSpotifyMeta(req, token, function(err, meta) {
      if(err) {
        console.log('[SPOTIFY] ERROR:'.red, err);
        return _reportAndReject(kugelblitz, err, item, deferred);
      }

      deferred.resolve(_.extend(item, {
        type: 'spotify',
        resolved: true,
        meta: _normalizeMeta(meta)
      }))
    });
  });

  return deferred.promise;
};
