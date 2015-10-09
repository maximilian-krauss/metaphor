'use strict'

class Spotify extends require('./test-base') {
  constructor() {
    super('https://open.spotify.com/user/donmaxo/playlist/6J86RUs2CAmZxJJ2n4MqWa');
  }
}

module.exports = new Spotify;
