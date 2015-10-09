'use strict'

Promise.all([
  require('./youtube').perform(),
  require('./soundcloud').perform(),
  require('./vimeo').perform(),
  require('./spotify').perform()
]).then(r => {
  console.log('All good!');
})
.catch(err => {
  console.error('Fuckup:', err);
});
