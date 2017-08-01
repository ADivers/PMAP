var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    bsync = require('browser-sync').create(),
    reload = bsync.reload;

gulp.task('styles', function () {
    return gulp.src('styles/*.css')
        .pipe(concat('all.css'))
        .pipe(gulp.dest('dist'));
});

gulp.task('scripts', function () {
    return gulp.src('scripts/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
       // .pipe(concat('all.js'))
        //.pipe(uglify())
        .pipe(gulp.dest('dist'));
});

gulp.task('serve', ['styles', 'scripts'], function (done) {
    bsync.reload();
    done();
});

var css_watcher = gulp.watch(['styles/*.css'], ['styles', 'serve']);
css_watcher.on('change', function (event) {
    console.log('CSS File' + event.path + ' was ' + event.type + ', running tasks...');
});

var scripts_watcher = gulp.watch(['scripts/*.js'], ['scripts', 'serve']);
scripts_watcher.on('change', function (event) {
    console.log('Script file ' + event.path + ' was ' + event.type + ', running tasks...');
});

var html_watcher = gulp.watch(['*.html'], ['serve']);
html_watcher.on('change', function (event) {
    console.log('HTML file' + event.path + ' was ' + event.type + ', running tasks...');
});

gulp.task('default', ['styles', 'scripts', 'serve'], function () {
    bsync.init(
        {
            server: {
                baseDir: './',
                //index: 'table_test.html'
                index: 'calendar_test.html'
            }
        }
    );
});
