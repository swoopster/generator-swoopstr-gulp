'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-generator').test;

describe('generator-swoopstr-gulp:karma', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/karma'))
      .withArguments("AngularJs")
      .on('end', done);
  });

  it('creates files', function () {
    assert.file([
      "karma.conf.js",
      "test/test-main.js"
    ]);
  });

  it('manipulate karma.conf', function (){
    assert.fileContent([
      ['karma.conf.js', "{pattern: 'bower_components/angular/angular.min.js', included: true},\n\t\t{pattern: 'bower_components/angular-mocks/angular-mocks.js', included: true}"]
    ]);
  })

});
