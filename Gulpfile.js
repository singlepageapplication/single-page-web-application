
/**
 * gulp node modules
 * @type {[type]}
 */
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var minify = require('gulp-minify-css');
var less = require('gulp-less');
var _ = require('underscore');

var rootPath = './dist/src';
var minPath = './dist/min';
var baseCssPath = './dist/min/css';

// 压缩dist/src里的js文件到 dist/min

gulp.task('js', function() {
    gulp.src(rootPath+'/*.js')
        .pipe(uglify())
        .pipe(gulp.dest(minPath))
});

gulp.task('baseless', function() {
    gulp.src('./css/style.less')
        .pipe(less())
        .pipe(minify())
        .pipe(gulp.dest(baseCssPath));
    console.log('baseless任务执行完了')
});


gulp.task('default',  function(){
    gulp.start('js','baseless');
});


