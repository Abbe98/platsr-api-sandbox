var gulp = require('gulp');
var cleanCSS = require('gulp-clean-css');
var gulpIf = require('gulp-if');
var uglify = require('gulp-uglify');
var autoprefixer = require('gulp-autoprefixer');
var useref = require('gulp-useref');
var unCSS = require('gulp-uncss');

var ghPages = require('gulp-gh-pages');

gulp.task('default', function() {
  return gulp.src('src/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('bootstrap.css', unCSS({
      html: ['src/*.html']
    })))
    .pipe(gulpIf('*.css', autoprefixer()))
    .pipe(gulpIf('*.css', cleanCSS()))
    .pipe(gulp.dest('dist'))
});

gulp.task('deploy', function() {
  return gulp.src('./dist/**/*')
    .pipe(ghPages({remoteUrl: 'git@github.com/Abbe98/platsr-api-sandbox.git'}));
});
