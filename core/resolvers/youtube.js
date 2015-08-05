var _ = require('lodash'),
    Q = require('q'),
    request = require('request'),
    pattern = /^https?:\/\/(www.|)(youtu.be\/|youtube.com\/(watch\?(.*&)?v=|(embed|v)\/))([^\?&\"\'>]+)$/,
    endpoint = 'https://www.googleapis.com/youtube/v3/videos';

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

module.exports = function(item) {
  var deferred = Q.defer();

  if(!pattern.test(item.url)) {
    deferred.reject(item);
    return deferred.promise;
  }

  var videoId = _(pattern.exec(item.url)).last();
  _fetchYoutubeMeta(videoId, function(err, meta) {
    if(err) {
      console.log('[YOUTUBE] Error:', err.message);
      deferred.reject(item);
      return deferred.promise;
    }

    item.meta = meta;
    item.type = 'youtube';

    deferred.resolve(item);
  });

  return deferred.promise;
}
