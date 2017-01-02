'use strict';

/**
 * Module dependencies.
 */


var _ = require('lodash'),
  gulp = require('gulp'),
  plugins = require('gulp-load-plugins')(),
  runSequence = require('run-sequence'),
  assetFiles = require('./server/assets'),
  assets = assetFiles.assets,
  testAssets = assetFiles.testAssets;

// Set NODE_ENV to 'test'
gulp.task('env:test', function () {
  process.env.NODE_ENV = 'test';
});

// Set NODE_ENV to 'development'
gulp.task('env:dev', function () {
  process.env.NODE_ENV = 'development';
});

// Set NODE_ENV to 'production'
gulp.task('env:prod', function () {
  process.env.NODE_ENV = 'production';
});

// Nodemon task
gulp.task('nodemon', function () {
  return plugins.nodemon({
    script: 'server.js',
    nodeArgs: ['--debug'],
    ext: 'js,html',
    verbose: true,
    watch: _.union(assets.views, assets.jsFiles)
  });
});

// Nodemon task without verbosity or debugging
gulp.task('nodemon-nodebug', function () {
  return plugins.nodemon({
    script: 'server.js',
    ext: 'js,html',
    watch: _.union(assets.views, assets.jsFiles)
  });
});

// Watch Files For Changes
gulp.task('watch', function () {
  // Start livereload
  plugins.refresh.listen();

  // Add watch rules
  gulp.watch(assets.views).on('change', plugins.refresh.changed);
  gulp.watch(assets.jsFiles, ['eslint']).on('change', plugins.refresh.changed); 
  gulp.watch(assets.cssFiles, ['csslint']).on('change', plugins.refresh.changed); 

});

// CSS linting task
gulp.task('csslint', function () {
  return gulp.src(assets.cssFiles)
    .pipe(plugins.csslint('.csslintrc'))
    .pipe(plugins.csslint.formatter());
    // Don't fail CSS issues yet
    // .pipe(plugins.csslint.failFormatter());
});

// ESLint JS linting task
gulp.task('eslint', function () {
  var srcs = _.union(
    assets.jsFiles, 
    testAssets.server,
    testAssets.client,
    testAssets.e2e
  );

  return gulp.src(srcs)
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format());
});


// Lint CSS and JavaScript files.
gulp.task('lint', function (done) {
  runSequence(['csslint', 'eslint'], done);
});


// Run the project in development mode
gulp.task('default', function (done) {
  runSequence('env:dev',  'lint', ['nodemon', 'watch'], done);
});

// Run the project in debug mode
gulp.task('debug', function (done) {
  runSequence('env:dev',   'lint', ['nodemon-nodebug', 'watch'], done);
});

// Run the project in production mode
gulp.task('prod', function (done) {
  runSequence( 'build', 'env:prod', 'lint', ['nodemon-nodebug', 'watch'], done);
});