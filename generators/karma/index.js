/**
 * Created by malte on 26.02.16.
 */
'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var fs = require('fs');

module.exports = yeoman.generators.Base.extend({

  constructor: function(){
    yeoman.generators.Base.apply(this, arguments);

    this.argument('frameworks', { type: Array, optional: true});
  },

  writing: function () {
    //copy template files
    this.fs.copy(this.templatePath("_karma.conf.js"), this.destinationPath('karma.conf.js'));
    this.copy("_test-main.js", "test/test-main.js");

  },

  install: function () {
    var dependencies = [
      'karma','karma-jasmine', 'karma-phantomjs-launcher'
    ];
    this.npmInstall(dependencies, {saveDev: true});
    this._installFrameworkTestDependencies();
  },

  _installFrameworkTestDependencies: function(){
    if(typeof this.frameworks === 'undefined'){
      return
    }

    var me = this;


    this.frameworks.forEach(function(framework)
    {
      switch(framework){
        case 'AngularJs':
          me.bowerInstall('angular', {save: true});
          me.bowerInstall('angular-mock', {saveDev: true});
          var path = me.destinationPath('karma.conf.js');
          fs.readFile(path, 'utf8', function(err, data){
            var result = data.replace("'src/**/*.module.js',", "{pattern: 'bower_components/angular/angular.min.js', included: true},\n\t\t{pattern: 'bower_components/angular-mocks/angular-mocks.js', included: true},'src/**/*.module.js',");
           fs.writeFile(path, result, 'utf8')
          });

          break;
      }


    });
  }
});
