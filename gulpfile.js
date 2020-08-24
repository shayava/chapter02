const eslint = require("gulp-eslint");
gulp.task("lint-server", function () {
  return gulp
    .src(["src/**/*.js", "!src/public/**/*.js"])
    .pipe(
      eslint({
        envs: ["es6", "node"],
        rules: {
          "no-unused-vars": [2, { argsIgnorePattern: "next" }],
        },
      })
    )
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});
gulp.task("lint-client", function () {
  return gulp
    .src("src/public/**/*.js")
    .pipe(eslint({ envs: ["browser", "jquery"] }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});
gulp.task("lint-test", function () {
  return gulp
    .src("test/**/*.js")
    .pipe(eslint({ envs: ["es6", "node", "mocha"] }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});
gulp.task("lint-integration-test", function () {
  return gulp
    .src("integration-test/**/*.js")
    .pipe(
      eslint({
        envs: ["browser", "phantomjs", "jquery"],
        rules: { "no-console": 0 },
      })
    )
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task("test", ["lint-test"], function () {
  env({ vars: { NODE_ENV: "test" } });
  return gulp.src("test/**/*.js").pipe(mocha());
});
gulp.task("lint", [
  "lint-server",
  "lint-client",
  "lint-test",
  "lint-integration-test",
]);
gulp.task("default", ["lint", "test"]);
