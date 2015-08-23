var _ = require('lodash'),
    Q = require('q'),
    request = require('request'),
    token = process.env.META_RESOLVER_VIMEO_ACCESS_TOKEN,
    pattern = /^https:\/\/vimeo.com\/([0-9]+)/ig,
    endpoint = 'https://api.vimeo.com/videos/';

function _andReject(deferred, item) {
  deferred.reject(item);
  return deferred.promise;
}

function _fetchVimeoMeta(id, cb) {
  var options = {
    url: endpoint + id,
    method: 'GET',
    auth: {
      bearer: token
    },
    json: true
  }

  request(options, function(err, res, body) {
    if(err || res.statusCode != 200) {
      return cb(err || body);
    }

    cb(null, body);
  });
}

function _getBestPicture(pictures) {
  if(!pictures || !pictures.sizes) {
    return undefined;
  }

  return _(pictures.sizes)
    .chain()
    .sortBy(function(t) { return t.width; })
    .map(function(t) { return t.link; })
    .last()
    .value();
}

function _normalizeMeta(id, meta) {
  return {
    id: id,
    title: meta.name,
    description: meta.description,
    createdAt: meta.created_time,
    previewImage: _getBestPicture(meta.pictures),
    plays: meta.stats.plays,
    likes: meta.metadata.connections.likes.total
  };
}

module.exports = function(item) {
  var deferred = Q.defer();
  if(!pattern.test(item.url)) {
    return _andReject(deferred, item);
  }

  pattern.lastIndex = 0;
  var videoId = _(pattern.exec(item.url)).last();

  _fetchVimeoMeta(videoId, function(err, meta) {
    if(err) {
      console.log('[VIMEO] Error:'.red, err);
      return _andReject(deferred, item);
    }

    deferred.resolve(_.extend(item, {
      type: 'vimeo',
      resolved: true,
      meta: _normalizeMeta(videoId, meta)
    }));
  });

  return deferred.promise;
};
