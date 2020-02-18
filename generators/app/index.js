"use strict";
const Generator = require("yeoman-generator");
const { resolve } = require("path");
const chalk = require("chalk");
const yosay = require("yosay");
const glob = require("glob");
const remote = require("yeoman-remote");
const yoHelper = require("@feizheng/yeoman-generator-helper");
const replace = require("replace-in-file");

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to the stunning ${chalk.red("generator-generator")} generator!`
      )
    );

    const prompts = [
      {
        type: "input",
        name: "project_name",
        message: "Your project_name?",
        default: yoHelper.discoverRoot
      },
      {
        type: "input",
        name: "boilerplate_name",
        message: "Your boilerplate_name?"
      },
      {
        type: "input",
        name: "description",
        message: "Your description?"
      }
    ];

    return this.prompt(prompts).then(
      function(props) {
        // To access props later use this.props.someAnswer;
        this.props = props;
        yoHelper.rewriteProps(props);
      }.bind(this)
    );
  }

  writing() {
    const done = this.async();
    remote(
      "afeiship",
      "boilerplate-generator",
      function(err, cachePath) {
        // Copy files:
        this.fs.copy(
          glob.sync(resolve(cachePath, "{**,.*}")),
          this.destinationPath()
        );
        done();
      }.bind(this)
    );
  }

  install() {
    this.npmInstall();
  }

  end() {
    const { project_name, boilerplate_name, ProjectName } = this.props;
    const files = glob.sync(resolve(this.destinationPath(), "{**,.*}"));

    replace.sync({
      files,
      from: [
        /boilerplate-generator/g,
        /boilerplate-name/g,
        /BoilerplateGenerator/g
      ],
      to: [project_name, boilerplate_name, ProjectName]
    });
  }
};
