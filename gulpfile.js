const { parallel , series } = require('gulp');
const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require("browser-sync").create();
const pug = require('gulp-pug');
const prefix = require('gulp-autoprefixer');
const concatCss = require('gulp-concat-css');
const image = require('gulp-image');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const named = require('vinyl-named');

function focus() {
    return gulp.src('src/img/*')
        .pipe(image())
        .pipe(gulp.dest('build/img'))
        .pipe(browserSync.stream())
}

function css() {
    return gulp.src('src/sass/**/*.sass')
        .pipe(sass())
        .pipe(prefix({
            browsers: ['last 20 versions']
        }))
        .pipe(concatCss("index.css"))
        .pipe(gulp.dest('build/css'))
        .pipe(browserSync.stream())
}

function html() {
    return gulp.src('src/pug/**/*.pug')
        .pipe(pug())
        .pipe(gulp.dest('build'))
        .pipe(browserSync.stream())
}

function js() {
    return gulp.src('src/js/**/*.js')
        .pipe(named())
        .pipe(webpackStream())
        .pipe(gulp.dest('build/js'))
        .pipe(browserSync.stream())
}

function server(){
    browserSync.init({
        server: {
            baseDir: "build"
        }
    });
}

function stream() {
    gulp.watch('src/sass/**/*.sass', gulp.parallel(css));
    gulp.watch('src/pug/**/*.pug', gulp.parallel(html));
    gulp.watch('src/js/**/*.js', gulp.parallel(js));
    gulp.watch('src/img/*', gulp.parallel(focus));
}

exports.default = series(parallel(js,html,css,focus),parallel(stream, server));
