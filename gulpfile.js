const gulp = require('gulp');
const babel = require('gulp-babel');
const livereload = require('gulp-livereload');

const src = 'src/**/*.js';

gulp.task('default', () =>
  gulp.src(src)
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(gulp.dest('./'))
    .pipe(livereload())
);

gulp.task('watch', function () {
  livereload.listen();
  gulp.watch(src, gulp.series('default'));
});
