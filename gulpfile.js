var gulp = require("gulp");
var mocha = require("gulp-mocha");
var env = require("gulp-env");

var eslint = require("gulp-eslint");
var istanbul = require("gulp-istanbul");

var shell = require("gulp-shell");
gulp.task("lint-server", function () {
  return gulp
    .src(["src/**/*.js", "!src/public/**/*.js"])
    .pipe(
      eslint({
        envs: ["es6", "node"],
        rules: {
          "no-unused-vars": [
            2,
            {
              rgsIgnorePattern: "next",
            },
          ],
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

gulp.task(
  "test",
  gulp.series("lint-test", function () {
    env({ vars: { NODE_ENV: "test" } });
    return gulp.src("test/**/*.js").pipe(mocha());
  })
);
gulp.task(
  "lint",
  gulp.series([
    "lint-server",
    "lint-client",
    "lint-test",
    "lint-integration-test",
  ])
);
gulp.task("default", gulp.series(["lint", "test"]));

gulp.task("instrument", function () {
  return gulp.src("src/**/*.js").pipe(istanbul()).pipe(istanbul.hookRequire());
});

gulp.task(
  "test",
  gulp.series(["lint-test", "instrument"], function () {
    gulp
      .src("test/**/*.js")
      .pipe(mocha())
      .pipe(istanbul.writeReports())
      .pipe(
        istanbul.enforceThresholds({
          thresholds: { global: 90 },
        })
      );
  })
);

gulp.task(
  "integration-test",
  gulp.series(["lint-integration-test", "test"], function (done) {
    var TEST_PORT = 5000;
    let server = require("http")
      .createServer(require("./src/app.js"))
      .listen(TEST_PORT, function () {
        gulp
          .src("integration-test/**/*.js")
          .pipe(
            shell(
              "node node_modules/phantomjs-prebuilt/bin/phantomjs<%=file.path%>",
              {
                env: { TEST_PORT: TEST_PORT },
              }
            )
          )
          .on("error", () => server.close(done))
          .on("end", () => server.close(done));
      });
  })
);
