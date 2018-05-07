const bunyan = require('bunyan');

module.exports = bunyan.createLogger({
  name: 'logger',
  level: bunyan.DEBUG,
  src: true
});

