'use strict';
var path = require('path');
var gulp = require('gulp');
var eslint = require('gulp-eslint');
var excludeGitignore = require('gulp-exclude-gitignore');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var nsp = require('gulp-nsp');
var plumber = require('gulp-plumber');

var fs = require('fs');
var argv = require('yargs').argv;
var rename = require('gulp-rename');
var bump = require("gulp-bump");
var filter = require("gulp-filter");
var tag_version = require('gulp-tag-version');
var git = require('gulp-git');
var if_else = require('gulp-if-else');

gulp.task('static', function () {
  return gulp.src('**/*.js')
    .pipe(excludeGitignore())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('nsp', function (cb) {
  nsp({package: path.resolve('package.json')}, cb);
});

gulp.task('pre-test', function () {
  return gulp.src('generators/**/*.js')
    .pipe(excludeGitignore())
    .pipe(istanbul({
      includeUntested: true
    }))
    .pipe(istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], function (cb) {
  var mochaErr;

  gulp.src('test/**/*.js')
    .pipe(plumber())
    .pipe(mocha({reporter: 'spec'}))
    .on('error', function (err) {
      mochaErr = err;
    })
    .pipe(istanbul.writeReports())
    .on('end', function () {
      cb(mochaErr);
    });
});

gulp.task('watch', function () {
  gulp.watch(['generators/**/*.js', 'test/**'], ['test']);
});

gulp.task('prepublish', ['nsp']);
gulp.task('default', ['static', 'test']);


gulp.task('bump', ['test'], function()
{
  var type = 'patch';
  if(argv.minor){
    type = 'minor';
  }else if(argv.major){
    type = 'major';
  }else if(argv.prerelease){
    type = 'prerelease';
  }
  gulp.src(['package.json', 'bower.json', 'component.json'])
    .pipe(bump({type:type}))
    .pipe(gulp.dest('./'))
    .pipe(if_else(typeof argv.m === 'string' ,function(){ return git.commit(argv.m)}, function(){ return git.commit('bumps package version')}))
    .pipe(filter('package.json'))
    .pipe(tag_version());

});
