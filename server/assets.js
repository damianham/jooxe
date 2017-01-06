/* 
 * determine the list of assets in the apps folder
 */

const globber = require('./helpers/glob_paths');

var assets = {
  views: globber(['apps/**/views/**/*.html','apps/**/www/templates/**/*.html']),
  jsFiles: globber('apps/**/*.js'),
  cssFiles: globber('apps/**/{css,less,scss}/*.css'),
  sassFiles: globber('apps/**/scss/*.scss'),
  lessFiles: globber('apps/**/less/*.less')
};

var testAssets = {
  views: globber('tests/**/views/**/*.html'),
  jsFiles: globber('tests/**/*.js'),
  cssFiles: globber('tests/**/{css,less,scss}/*.css'),
  sassFiles: globber('tests/**/scss/*.scss'),
  lessFiles: globber('tests/**/less/*.less')
};

module.exports = {assets: assets, testAssets: testAssets};