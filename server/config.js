'use strict';

/**
 * Module dependencies.
 */
const _ = require('lodash'),
  chalk = require('chalk'),
  glob = require('glob'),
  fs = require('fs'),
  path = require('path');



/**
 * Validate NODE_ENV existence
 */
const validateEnvironmentVariable = function () {
  const environmentFiles = glob.sync('server/config/' + process.env.NODE_ENV + '.js');
  console.log();
  if (!environmentFiles.length) {
    if (process.env.NODE_ENV) {
      console.error(chalk.red('+ Error: No configuration file found for "' + process.env.NODE_ENV + '" environment using development instead'));
    } else {
      console.error(chalk.red('+ Error: NODE_ENV is not defined! Using default development environment'));
    }
    process.env.NODE_ENV = 'development';
  }
  // Reset console color
  console.log(chalk.white(''));
};


/**
 * Initialize global configuration
 */
const initGlobalConfig = function () {
  // Validate NODE_ENV existence
  validateEnvironmentVariable();
  
  // Get the default config
  const defaultConfig = require(path.join(process.cwd(), 'server/config/default'));

  // Get the current config
  const environmentConfig = require(path.join(process.cwd(), 'server/config/', process.env.NODE_ENV)) || {};

  // Merge config files
  var config = _.merge(defaultConfig, environmentConfig);

  // read package.json for MEAN.JS project information
  const pkg = require(path.resolve('./package.json'));
  config.jooxe = pkg;

  // Extend the config object with the local-NODE_ENV.js custom/local environment. This will override any settings present in the local configuration.
  config = _.merge(config, (fs.existsSync(path.join(process.cwd(), 'server/config/local-' + process.env.NODE_ENV + '.js')) && require(path.join(process.cwd(), 'server/config/local-' + process.env.NODE_ENV + '.js'))) || {});

  return config;
};

/**
 * Set configuration object
 */
module.exports = initGlobalConfig();
