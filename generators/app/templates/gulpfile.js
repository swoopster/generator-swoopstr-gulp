'use strict';

var fs = require('fs');
var gulp = require('gulp');
var argv = require('yargs').argv;
var rename = require('gulp-rename');
var bump = require("gulp-bump");
var filter = require("gulp-filter");
var tag_version = require('gulp-tag-version');
var git = require('gulp-git');
var if_else = require('gulp-if-else');


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
