'use strict';

var defaultEnvConfig = require('./default');

module.exports = {
 app: {
    title: defaultEnvConfig.app.title + ' - Development Environment'
  },
  log: {
    // logging with Morgan - https://github.com/expressjs/morgan
    // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
    format: 'dev',
    fileLogger: {
      directoryPath: process.cwd(),
      fileName: 'app.log',
      maxsize: 10485760,
      maxFiles: 2,
      json: false
    }
  },
  livereload: true
};
