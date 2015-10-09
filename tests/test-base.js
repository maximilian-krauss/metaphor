'use strict'

const request = require('request');

class TestBase {
  constructor(url) {
    this.url = url;
  }

  perform() {
    let options = {
      url: 'http://localhost:9090/resolve',
      method: 'POST',
      body: [ this.url ],
      json: true
    }

    let promise = new Promise((rs, rj) => {
      request(options, (err, res, body) => {
        if(err || res.statusCode !== 200) {
          return rj(err || new Error(body.error))
        }

        if(body[0].type === 'unknown') {
          return rj(new Error(`Failed to resolve ${this.url}`));
        }

        return rs(body);
      });
    });

    return promise;
  }
}

module.exports = TestBase;
