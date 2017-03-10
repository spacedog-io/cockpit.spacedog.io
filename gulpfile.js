var gulp = require('gulp');
var sass = require('gulp-sass');
var webserver = require('gulp-webserver');

gulp.task('sass', function(done) {
  gulp.src('./scss/main.scss')
    .pipe(sass())
    .pipe(gulp.dest('./styles/'))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(['./scss/**/*.scss'], ['sass']);
});

gulp.task('webserver', function() {
  gulp.src('./')
    .pipe(webserver({
      livereload: true,
      livereload:{
        port:35739
      },
      directoryListing: false,
      open: true,
      port:8282
    }));
});

gulp.task('default', ['sass', 'webserver', 'watch']);
