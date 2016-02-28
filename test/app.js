'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-generator').test;

describe('generator-swoopstr-gulp:app', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withOptions({someOption: true})
      .withPrompts({
        bowerTitle: "angularTest",
        bowerDesc: "",
        bowerURL: "https://test.de",
        fullName: "Max Mustermann",
        email: "max@test.de"
      })
      .on('end', done);
  });

  it('creates files', function () {
    assert.file([
      'gulpfile.js',
      '.bowerrc',
      'bower.json',
      "src/",
      "test/",
      "bower_components/"
    ]);
  });

  it('test bowerfile creation', function(){
    assert.fileContent([
      ['bower.json', '"name": "angular-test"'],
      ['bower.json', '"title": "angularTest'],
      ['bower.json', '"description": "'],
      ['bower.json', '"name": "Max Mustermann"'],
      ['bower.json', '"Max Mustermann max@test.de"']
    ]);
  })


  it('test bowerfile creation', function(){
    assert.fileContent([
      ['package.json', '"name": "angular-test"'],
      ['package.json', /"author": \{\n.*"name"\: "Max Mustermann",\n.*"email"\: "max@test\.de",\n.*"url"\: "/],
    ]);
  })


});
