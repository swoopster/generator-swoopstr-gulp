'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var mkdirp = require('mkdirp');

module.exports = yeoman.generators.Base.extend({
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay('Welcome to the marvelous Bower Package generator!'));

    var prompts = [{
      name: 'bowerTitle',
      message: 'What is your package\'s title?',
      default: this.config.get('context') ? this.config.get('context')['bower_title'] : this.appname
    }, {
      name: 'bowerDesc',
      message: 'What is your package description?',
      default: this.config.get('context') ? this.config.get('context')['bower_desc'] : undefined
    },
      {
      name: 'bowerURL',
      message: 'Please enter your git reposotory url. \ncreate a git repo - has it required by any bower component \n(for exmaple - https://github.com/yuvalsaraf/real-gallery)',
      default: this.config.get('context') ? this.config.get('context')['bower_url'] : undefined
    }, {
      name: 'fullName',
      message: 'What\'s your name?',
      default: this.config.get('context') ? this.config.get('context')['full_name'] : undefined
    },
      {
        name: 'email',
        message: 'What\'s your email address?',
        default: this.config.get('context') ? this.config.get('context')['email'] : undefined
      },
      {
        name: "framework",
        type: 'list',
        message: 'choose used frameworks',
        choices: ['AngularJs']
      }];

    this.prompt(prompts, function(props) {
      this.bowerTitle = props.bowerTitle;
      this.bowerName = this.bowerTitle.replace(/([A-Z])/g, '-$1').toLowerCase();
      this.bowerDesc = props.bowerDesc;
      this.bowerURL = props.bowerURL;
      this.fullName = props.fullName;
      this.email = props.email;
      this.frameworks = props.framework;

      done();
    }.bind(this));
  },

  writing: function () {
    //copy gulpfile
    this.fs.copy(
      this.templatePath('_gulpfile.js'),
      this.destinationPath('gulpfile.js')
    );
    this.copy("_.bowerrc", '.bowerrc');

    mkdirp.sync(this.destinationPath("src/"));
    mkdirp.sync(this.destinationPath("test/"));
    mkdirp.sync(this.destinationPath("bower_components/"));


    //configure bower.json and package.json
    var context = {
      bower_name: this.bowerName,
      bower_title: this.bowerTitle,
      bower_desc: this.bowerDesc,
      bower_url: this.bowerURL,
      full_name: this.fullName,
      email: this.email
    };

    this.template("_bower.json", "bower.json", context);
    this.template("_package.json", "package.json", context);
  },

  install: function () {
    if (this.options['skip-install']) {
      return;
    }
    this.installDependencies();

  },

  invokeSubGenerators: function() {
    if(typeof this.frameworks !== 'undefined'){
      this.invokeSubGenerators('swoopstr-gulp:karma', {nested: true, appName: this.appName}).withArguments({'frameworks': this.frameworks})
    }
  }

});
