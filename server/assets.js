/* 
 * determine the list of assets in the apps folder
 */

const globber = require('./helpers/glob_paths');

var server = {
  views: globber(['apps/**/api/**/views/**/*.html']),
  jsFiles: globber(['apps/**/api/**/*.js','server/**/*.js','apps/*/*.js','apps/*/config/*.js']),
  cssFiles: globber('apps/**/api/**/{css,less,scss}/*.css'),
  sassFiles: globber('apps/**/api/**/scss/*.scss'),
  lessFiles: globber('apps/**/api/**/less/*.less')
};

var client = {
    views: globber(['apps/**/views/**/*.html','apps/**/www/templates/**/*.html'],null,['apps/**/api/**/*.html','apps/**/dist/**/*.html','apps/**/build/**/*.html']),
    jsFiles: globber('apps/**/*.js',null,['apps/**/api/**/*.js',,'apps/**/dist/**/*.js','apps/**/build/**/*.js','apps/**/*.min.js']),
    cssFiles: globber('apps/**/{css,less,scss}/*.css',null,['apps/**/api/**/*.css','apps/**/dist/**/*.css','apps/**/build/**/*.css','apps/**/*.min.css']),
    sassFiles: globber('apps/**/scss/*.scss',null,['apps/**/api/**/*.scss']),
    lessFiles: globber('apps/**/less/*.less',null,['apps/**/api/**/*.less'])
  };

var test = {
  views: globber('tests/**/views/**/*.html'),
  jsFiles: globber('tests/**/*.js'),
  cssFiles: globber('tests/**/{css,less,scss}/*.css'),
  sassFiles: globber('tests/**/scss/*.scss'),
  lessFiles: globber('tests/**/less/*.less')
};

module.exports = {server: server, client: client, test: test};