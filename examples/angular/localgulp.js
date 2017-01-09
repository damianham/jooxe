var gulp = require('gulp');  
var concat = require('gulp-concat'); 
var rename = require('gulp-rename'); 
var uglify = require('gulp-uglify'); 

var DEST = 'build/';

gulp.task('build', function() {
  return gulp.src('www/js/**/*.js')   
  .pipe(concat("application.js"))
  // This will output the non-minified version
  .pipe(gulp.dest(DEST))
  // This will minify and rename to application.min.js
  .pipe(rename("application.min.js"))
  .pipe(uglify()) 
  .pipe(gulp.dest(DEST));
  
});
