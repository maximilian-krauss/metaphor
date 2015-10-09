'use strict'

class Youtube extends require('./test-base') {
  constructor() {
    super('https://www.youtube.com/watch?v=NtDG-Cnj-pw');
  }
}

module.exports = new Youtube;
