function Core() {
  return {
    resolver: require('./resolver')
  }
}

module.exports = new Core();
