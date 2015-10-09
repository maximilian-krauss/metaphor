var _ = require('lodash'),
    Q = require('q'),
    moment = require('moment'),
    request = require('request'),
    pattern = /^https?:\/\/(www.|)(youtu.be\/|youtube.com\/(watch\?(.*&)?v=|(embed|v)\/))([^\?&\"\'>]+)$/,
    endpoint = 'https://www.googleapis.com/youtube/v3/videos';

function _getBestThumbnail(thumbnails) {
  if(!thumbnails) {
    return undefined;
  }

  return _(thumbnails)
    .chain()
    .sortBy(function(t) { return t.width; })
    .map(function(t) { return t.url; })
    .last()
    .value();
}

function _normalizeMeta(videoId, meta) {
  return {
    id: videoId,
    title: meta.snippet.title,
    description: meta.snippet.description,
    createdAt: meta.snippet.publishedAt,
    previewImage: _getBestThumbnail(meta.snippet.thumbnails),
    plays: meta.statistics.viewCount,
    likes: meta.statistics.likeCount,
    duration: moment.duration(meta.contentDetails.duration).asMilliseconds()
  };
}

function _fetchYoutubeMeta(id, callback) {
  var apiKey = process.env.META_RESOLVER_YOUTUBE_API_KEY;
  if(!apiKey) {
    return callback(new Error('No YouTube API key provided!'));
  }

  var options = {
    json: true,
    qs: {
      id: id,
      part: ['snippet', 'statistics', 'contentDetails'].join(','),
      key: apiKey
    }
  }

  request.get(endpoint, options, function(err, res, body) {
    if(err || !body.items) {
      return callback(err || new Error('Video not found'));
    }

    var item = body.items[0],
        meta = {
          snippet: item.snippet,
          contentDetails: item.contentDetails,
          statistics: item.statistics
        };

    callback(null, meta);
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

  var videoId = _(pattern.exec(item.url)).last();
  _fetchYoutubeMeta(videoId, function(err, meta) {
    if(err) {
      console.log('[YOUTUBE] Error:'.red, err.message);
      return _reportAndReject(kugelblitz, err, item, deferred);
    }

    deferred.resolve(_.extend(item, {
      type: 'youtube',
      resolved: true,
      meta:  _normalizeMeta(videoId, meta)
    }));
  });

  return deferred.promise;
}
