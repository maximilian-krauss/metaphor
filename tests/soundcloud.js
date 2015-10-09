'use strict'

class SoundCloud extends require('./test-base') {
  constructor() {
    super('https://soundcloud.com/dgtl-festival/nto-dgtl-festival-2014');
  }
}

module.exports = new SoundCloud;
