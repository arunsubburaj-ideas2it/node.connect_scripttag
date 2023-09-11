const gulp = require('gulp');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');

function minifyJS() {
  return gulp
    .src('./*.js') // Source folder containing your JavaScript files to minify
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest('src/')); // Destination folder for minified JS files
}

function minifyCSS() {
    return gulp
      .src('./*.css') // Source folder containing your CSS files to minify
      .pipe(cleanCSS())
      .pipe(rename({ extname: '.min.css' }))
      .pipe(gulp.dest('src/')); // Destination folder for minified CSS files
  }

function minifyAllJS() {
  return gulp
    .src('./*.js') // Source folder containing your JavaScript files to minify
    .pipe(uglify())
    .pipe(concat('all.min.js'))
    .pipe(gulp.dest('src/')); // Destination folder for the minified and concatenated JS file
}

function minifyAllCss() {
    return gulp
      .src('./*.css') // Source folder containing your CSS files to minify
      .pipe(cleanCSS())
      .pipe(concat('all.min.css'))
      .pipe(gulp.dest('src/')); // Destination folder for the minified and concatenated JS file
  }

(function (){
    minifyAllJS();
    minifyAllCss();
})()
