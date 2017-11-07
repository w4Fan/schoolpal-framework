"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var concat = require('gulp-concat'); 

gulp.task("sass", function() {
  return gulp
    .src("./src/sass/**/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest("./dist/"));
});

gulp.task("js", function() {
  return gulp.src("./src/sass/**/*.js")
  .pipe(concat('schoolpal.js'))
  .pipe(gulp.dest("./dist/"));
});
