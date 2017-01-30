/* 
 * Helper methods useful to all apps
 */

const _ = require('lodash'), 
  glob = require('glob');

/**
 * Get files by glob patterns
 */
var getGlobbedPaths = function (globPatterns, excludes,ignore_paths=[]) {
  // URL paths regex
  var urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');

  // The output array
  var output = [];

  // If glob pattern is array then we use each pattern in a recursive way, otherwise we use glob
  if (_.isArray(globPatterns)) {
    globPatterns.forEach(function (globPattern) {
      output = _.union(output, getGlobbedPaths(globPattern, excludes));
    });
  } else if (_.isString(globPatterns)) {
    if (urlRegex.test(globPatterns)) {
      output.push(globPatterns);
    } else { 
      // ignore any files in public lib installed with bower
      // ignore node modules in sub apps
      // ignore passed in paths
      var files = glob.sync(globPatterns,{
        ignore: ignore_paths.concat([
          'apps/**/public/lib/**/*',
          'apps/**/www/lib/**/*',
          'apps/**/hooks/**/*',
          'apps/**/platforms/**/*',
          'apps/**/plugins/**/*',
          'apps/**/node_modules/**/*'
        ])});
      if (excludes) {
        files = files.map(function (file) {
          if (_.isArray(excludes)) {
            for (var i in excludes) {
              if (excludes.hasOwnProperty(i)) {
                file = file.replace(excludes[i], '');
              }
            }
          } else {
            file = file.replace(excludes, '');
          }
          return file;
        });
      }
      output = _.union(output, files);
    }
  }

  return output;
};

module.exports = getGlobbedPaths;

