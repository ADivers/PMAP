var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    bsync = require('browser-sync').create(),
    reload = bsync.reload,
    jsdoc = require(  'gulp-jsdoc3'  ),
    jasmine = require(  'gulp-jasmine'  );


//Create tasks for js, css, html, and unit-test
gulp.task(  'js', function(){
  return(  gulp.src(  './scripts/*.js'  )
            .pipe(  jshint()  )
            .pipe(  jshint.reporter(  'default'  )  )
            .pipe(  uglify()  )
            .pipe(  concat(  'all.js'  )  )
            .pipe(  gulp.dest(  './dist'  )  )
  );
});


gulp.task(  'css', function(){
  return(  gulp.src(  './styles/*.css'  )
            .pipe(  concat(  'all.css'  )  )
            .pipe( gulp.dest(  './dist'  )  )
  );
});

gulp.task(  'html', function(){
  bsync.reload();
});

gulp.task(  'unit-test', function(){
  return(  gulp.src(  './specs/*.js'  )
            .pipe(  jasmine(
              {
                verbose   :   true
              }
            )
          )
  );
});


//Create reload tasks for js, css, html
//done() ensures that tasks are complete before reloading browser
  //syntax:
  //gulp.task(  taskName [, deps] [,fn]  );
  //taskName: String. Name of the task
  //deps: Array. An array of tasks to be executed before your task will run.
  //fn: Function. Function that performs the task's work.
gulp.task(  'js-reload', [  'js'  ], function(  done  ){
  bsync.reload();
  done();
});

gulp.task(  'css-reload', [  'css'  ], function(  done  ){
  bsync.reload();
  done();
});

//Create default task; run 'js', 'css', 'html', 'unit-test'
//on load
gulp.task(  'default', [  'js', 'css', 'html', 'unit-test'  ], function(){

  bsync.init(
    {
      server: {
        baseDir : './',
        index   : 'index.html'
      }
    }
  )
});

//Create watchers
var jsWatcher = gulp.watch(  './scripts/*.js', [  'js', 'js-reload'  ]  );
jsWatcher.on(  'change', function(  event  ){
  console.log(  'File ' + event.path + ' was ' + event.type  +
  ', running tasks "js" and "js-reload..."'  );
});

var cssWatcher = gulp.watch(  './styles/*.css', [  'css', 'css-reload'  ]  );
cssWatcher.on(  'change', function(  event  ){
  console.log(  'File ' + event.path + ' was ' + event.type +
  ', running tasks "css" and "css-reload"...'  );
});

var specWatcher = gulp.watch(  './specs/*.js', [  'unit-test'  ]  );
specWatcher.on(  'change', function(  event  ){
  console.log(  'File ' + event.path + ' was ' + event.type +
', running task "unit-test"...'  );
});
