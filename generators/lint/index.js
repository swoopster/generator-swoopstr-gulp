/**
 * Created by malte on 26.02.16.
 */
'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var fs = require('fs');

module.exports = yeoman.generators.Base.extend({

  writing: function () {
    //copy template files
    this.copy("_.jshintrc", ".jshintrc");
    this.copy("_.jscsrc", ".jscsrc");

  },

  install: function () {
    var dependencies = [
      'jshint', 'jscs'
    ];
    this.npmInstall(dependencies, {saveDev: true});
  }
});
