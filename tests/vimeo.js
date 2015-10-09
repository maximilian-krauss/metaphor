'use strict'

class Vimeo extends require('./test-base') {
  constructor() {
    super('https://vimeo.com/31836365');
  }
}

module.exports = new Vimeo;
