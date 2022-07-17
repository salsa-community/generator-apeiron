let gulp = require('gulp');
let concat = require('gulp-concat');
let rename = require('gulp-rename');
let uglify = require('gulp-uglify');
let pkg = require('./package.json');

gulp.task('build', function () {
  return gulp
    .src('./src/*.js')
    .pipe(concat(pkg.name + '.js'))
    .pipe(gulp.dest('./dist'))
    .pipe(rename(pkg.name + '.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist'));
});
