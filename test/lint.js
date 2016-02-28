'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-generator').test;

describe('generator-swoopstr-gulp:lint', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/lint'))
      .on('end', done);
  });

  it('creates files', function () {
    assert.file([
      ".jscsrc",
      ".jshintrc"
    ]);
  });

});
