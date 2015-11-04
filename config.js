'use strict'

class Config {
  constructor() {
    this._production = process.env.NODE_ENV === 'production';
    this._kugelblitz = {
      endpoint: process.env.KUGELBLITZ_ENDPOINT,
      token: process.env.KUGELBLITZ_TOKEN,
      callbackUrl: process.env.KUGELBLITZ_CALLBACK
    };
  }

  get production() {
    return this._production;
  }

  get kugelblitz() {
    return this._kugelblitz;
  }

}

module.exports = new Config();
