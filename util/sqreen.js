const logger = require('./logger');

module.exports = token => {
  if (token) {
    require('sqreen');
    logger.info('Sqreen status: ENABLED');
  } else {
    logger.info('Sqreen status: DISABLED');
  }
};
