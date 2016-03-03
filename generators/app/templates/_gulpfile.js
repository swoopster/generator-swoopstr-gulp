'use strict';

var gulp = require('gulp');
var argv = require('yargs').argv;
var rename = require('gulp-rename');
var bump = require("gulp-bump");
var filter = require("gulp-filter");
var tag_version = require('gulp-tag-version');
var git = require('gulp-git');
var if_else = require('gulp-if-else');
var fs = require('fs');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var Server = require('karma').Server;

var config = {
  distFolder : 'dist',
  srcFiles : ['src/**/*.js']
};

gulp.task('build-js', function()
{
  gulp.src(config.srcFiles)
    .pipe(concat(JSON.parse(fs.readFileSync('./package.json')).name + '.js'))
    .pipe(gulp.dest(config.distFolder))
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(config.distFolder));
});

gulp.task('test', function(done)
{
  return Server.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done);
});

gulp.task('bump', function()
{
  var type = 'patch';
  if(argv.minor){
    type = 'minor';
  }else if(argv.major){
    type = 'major';
  }else if(argv.prerelease){
    type = 'prerelease';
  }

  gulp.src('./package.json')
    .pipe(bump({type:type}))
    .pipe(gulp.dest('./'))
    .pipe(if_else(typeof argv.m === 'string' ,
      function(){ return git.commit(argv.m)},
      function(){ return git.commit('bumps package version')})
    )
    .pipe(filter('package.json'))
    .pipe(if_else(typeof argv.v === 'string',
      function(){
        return tag_version({version: argv.v})
      },
      function(){
        return tag_version()
      }
    ));

});

gulp.task('release', ['build-js', 'bump']);
