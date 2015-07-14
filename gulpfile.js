var gulp = require('gulp');
var bump = require('gulp-bump');
var format = require('gulp-format');

gulp.task('format.check', function() {
  return gulp.src(['gulpfile.js', './src/**/*.ts'])
      .pipe(format.check('file'))
      .on('warning', function(e) {
        process.stdout.write(e.message);
        process.exit(-1)
      });
});

gulp.task('format', function() {
  gulp.src(['gulpfile.js', './src/**/*.ts'])
      .pipe(format('file'))
      .on('info', function(e) {
        process.stdout.write(e.message);
      });
});

gulp.task('test', function() {
  console.error('Not Implemented!');
});

gulp.task('build', ['format.check'], function() {
  gulp.src('./package.json').pipe(bump({type: 'build'})).pipe(gulp.dest('./'));
});
