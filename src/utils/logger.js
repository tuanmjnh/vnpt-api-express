const winston = require('winston');
// import { Logger } from "winston";
// const secrets = require('./secrets');

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: process.env.NODE_ENV === 'production' ? 'error' : 'debug'
    }),
    new winston.transports.File({
      level: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
      filename: process.env.NODE_ENV === 'production' ? 'error.log' : 'debug.log'
    })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  winston.debug('Logging initialized at debug level');
}

module.exports = winston;
