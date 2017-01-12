'use strict';

/**
 * Module dependencies.
 */


var _ = require('lodash'),
  fs = require('fs'),
  path = require('path'),
  gulp = require('gulp'),
  plugins = require('gulp-load-plugins')(),
  runSequence = require('run-sequence'),
  assetFiles = require('./server/assets'),
  assets = assetFiles.assets,
  testAssets = assetFiles.testAssets;

var spawnSync = require('child_process').spawnSync;
const globber = require('./server/helpers/glob_paths')

function getFolders(dir) {
  return fs.readdirSync(dir)
    .filter(function(file) {
      return fs.statSync(path.join(dir, file)).isDirectory();
    });
}

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

// run npm install in each subapp
gulp.task('npmapps', function() {
    var files = globber('apps/*/package.json'); 

    files.map(function(filename) {
      var folder = path.dirname(filename)
      var res = spawnSync('npm', ['install'], { cwd: folder, stdio: 'inherit' }) ;
      console.log('finished npm install in ', folder, 'with code',res.code);
    });
    return true;
});

// run bower install in each subapp
gulp.task('bowerapps', function() {
  var files = globber('apps/*/bower.json'); 

  files.map(function(filename) {
    var folder = path.dirname(filename)
    var res = spawnSync('npm', ['install'], { cwd: folder, stdio: 'inherit' });
    console.log('finished bower install in ', folder, 'with code',res.code);
  });
  return true;
});

// build the web distribution in each subapp
// i.e. minify/uglify and package into single js/css files
gulp.task('buildapps', function() {
  var files = globber('apps/*/localgulp.js'); 

  files.map(function(filename) {
    var folder = path.dirname(filename)
    var res = spawnSync('gulp', ['--gulpfile','localgulp.js','build'], { cwd: folder, stdio: 'inherit' }) ;
    console.log('finished build in ', folder, 'with code',res.code);
  });
  return true;
});

gulp.task('build', function (done) {
  runSequence('npmapps',  'bowerapps', 'buildapps', done);
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