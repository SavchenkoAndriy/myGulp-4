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
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');

gulp.task('img',function() {
    return gulp.src('src/img/*')
        .pipe(image())
        .pipe(gulp.dest('ready/img'))
        .pipe(browserSync.stream())
});

gulp.task('css',function() {
    return gulp.src('src/sass/**/*.sass')
        .pipe(sass())
        .pipe(prefix({
            browsers: ['last 20 versions']
        }))
        .pipe(concatCss("index.css"))
        .pipe(gulp.dest('ready/css'))
        .pipe(browserSync.stream())
});

gulp.task('html', function(){
    return gulp.src('src/pug/**/*.pug')
        .pipe(pug())
        .pipe(gulp.dest('ready'))
        .pipe(browserSync.stream())
});

gulp.task( 'js' ,function() {
    return gulp.src('src/js/**/*.js')
        // .pipe(babel({
        //     presets: ['@babel/env']
        // }))
        //.pipe(uglify())
        //.pipe(concat('main.js'))
        //.pipe(named())
        // .pipe(webpackStream())
        // .pipe(concat('main.js'))
        .pipe(webpackStream({
            output: {
                filename: "[name].js"
            },
            module: {
                rules: [
                    {
                        test: /\.(js)$/,
                        exclude: /(node_modules)/,
                        loader: 'babel-loader',
                        query: {
                            presets: ['env']
                        }
                    }
                ]
            }
        }))
        .pipe(gulp.dest('ready/js'))
        .pipe(browserSync.stream())
});

gulp.task('server',function(){
    browserSync.init({
        server: {
            baseDir: "ready"
        }
    });
});

gulp.task( 'watch',function() {
    gulp.watch('src/sass/**', gulp.parallel('css'));
    gulp.watch('src/pug/**/*.pug', gulp.parallel('html'));
    gulp.watch('src/js/**/*.js', gulp.parallel('js'));
    gulp.watch('src/img/*', gulp.parallel('img'));
});

exports.default = series(parallel('js','html','css','img'),parallel('watch', 'server'));
