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
  assets = require('./server/assets');

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
    var res = spawnSync('bower', ['install'], { cwd: folder, stdio: 'inherit' });
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
  runSequence( 'bowerapps', 'buildapps', done);
});


// Nodemon task
gulp.task('nodemon', function () {
  return plugins.nodemon({
    script: 'server.js',
    nodeArgs: ['--debug'],
    ext: 'js,html',
    verbose: true,
    watch: _.union(assets.server.views, assets.server.jsFiles,assets.server.cssFiles,assets.server.sassFiles,assets.server.lessFiles)
  });
});

// Nodemon task without verbosity or debugging
gulp.task('nodemon-nodebug', function () {
  return plugins.nodemon({
    script: 'server.js',
    ext: 'js,html',
    watch: _.union(assets.server.views, assets.server.jsFiles,assets.server.cssFiles,assets.server.sassFiles,assets.server.lessFiles)
  });
});

// Watch Files For Changes
gulp.task('watch', function () {
  // Start livereload
  plugins.refresh.listen();

  // Add watch rules to reload the browser when client files change
  gulp.watch(assets.client.views).on('change', plugins.refresh.changed);  
  gulp.watch(assets.client.jsFiles).on('change', plugins.refresh.changed); 
  gulp.watch(assets.client.cssFiles).on('change', plugins.refresh.changed); 
  
  // only process the modified files
  gulp
  .watch(assets.client.jsFiles)
  .on("change", function(event) {
      gulp
        .src(event.path)
        .pipe(plugins.eslint())
        .pipe(plugins.eslint.format());
  });
  
//only process the modified files
  gulp
  .watch(assets.client.cssFiles)
  .on("change", function(file) {
      gulp
        .src(file.path)
        .pipe(plugins.csslint('.csslintrc'))
        .pipe(plugins.csslint.formatter());
  });
});

// CSS linting task
gulp.task('csslint', function () {
  return gulp.src(assets.client.cssFiles)
    .pipe(plugins.csslint('.csslintrc'))
    .pipe(plugins.csslint.formatter());
    // Don't fail CSS issues yet
    // .pipe(plugins.csslint.failFormatter());
});

//ESLint JS linting task
gulp.task('serverlint', function () {

  return gulp.src(assets.server.jsFiles)
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format());
});

//ESLint JS linting task
gulp.task('testlint', function () {

  return gulp.src(assets.test.jsFiles)
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format());
});

// ESLint JS linting task
gulp.task('eslint', function () {

  return gulp.src(assets.client.jsFiles)
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format());
});

gulp.task('files',function(done){
  console.log('========server========');
  console.log('views',assets.server.views);
  console.log('javascript',assets.server.jsFiles);
  console.log('css',assets.server.cssFiles);
  console.log('sass',assets.server.sassFiles);
  console.log('less',assets.server.lessFiles);
  
  console.log('========client========')
  console.log('views',assets.client.views);
  console.log('javascripts',assets.client.jsFiles);
  console.log('css',assets.client.cssFiles);
  console.log('sass',assets.client.sassFiles);
  console.log('less',assets.client.lessFiles);
})



// Lint CSS and JavaScript files.
gulp.task('lint', ['serverlint','testlint'],function (done) {
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

//Run the project in debug mode
gulp.task('test', function (done) {
  runSequence('env:test',   'testlint', ['nodemon-nodebug', 'watch'], done);
});

// Run the project in production mode
gulp.task('prod', function (done) {
  runSequence( 'build', 'env:prod', 'lint', ['nodemon-nodebug', 'watch'], done);
});