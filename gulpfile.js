'use strict';
const gulp = require('gulp');
const mocha = require('gulp-mocha');
const env = require('gulp-env');
gulp.task('test', function () {
  env({ vars: { NODE_ENV: 'test' } });
  return gulp.src('test/**/*.js').pipe(mocha());
});
gulp.task('default', ['test']);
