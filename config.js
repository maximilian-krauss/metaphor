'use strict'

class Config {
  constructor() {
    this._production = process.env.NODE_ENV === 'production';
    this._meerkat = {
      endpoint: process.env.MEERKAT_ENDPOINT,
      token: process.env.MEERKAT_TOKEN
    };
  }

  get production() {
    return this._production;
  }

  get meerkat() {
    return this._meerkat;
  }

}

module.exports = new Config();
