"use strict";
const Generator = require("yeoman-generator");
const { resolve } = require("path");
const chalk = require("chalk");
const yosay = require("yosay");
const glob = require("glob");
const remote = require("yeoman-remote");
const yoHelper = require("@jswork/yeoman-generator-helper");
const replace = require("replace-in-file");

require("@jswork/next-registry-choices");

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
        name: "scope",
        message: "Your scope (eg: `babel` )?",
        default: "jswork",
      },
      {
        type: "list",
        name: "registry",
        message: "Your registry",
        choices: nx.RegistryChoices.gets(),
      },
      {
        type: "input",
        name: "project_name",
        message: "Your project_name?",
        default: yoHelper.discoverRoot,
      },
      {
        type: "input",
        name: "boilerplate_name",
        message: "Your boilerplate_name (eg: `boilerplate-github` )?",
      },
      {
        type: "input",
        name: "description",
        message: "Your description?",
      },
    ];

    return this.prompt(prompts).then(
      (props) => {
        // To access props later use this.props.someAnswer;
        this.props = props;
        yoHelper.rewriteProps(props);
      }
    );
  }

  writing() {
    const done = this.async();
    remote(
      "afeiship",
      "boilerplate-generator",
      (err, cachePath) => {
        // Copy files:
        this.fs.copyTpl(
          glob.sync(resolve(cachePath, "{**,.*}")),
          this.destinationPath(),
          this.props
        );
        done();
      }
    );
  }

  install() {
    // this.npmInstall();
  }

  end() {
    const { scope, project_name, boilerplate_name, ProjectName } = this.props;
    const files = glob.sync(
      resolve(this.destinationPath(), "{**,.*}")
    );

    replace.sync({
      files,
      from: [
        /boilerplate-scope/,
        /boilerplate-generator/g,
        /boilerplate-name/g,
        /BoilerplateGenerator/g
      ],
      to: [scope, project_name, boilerplate_name, ProjectName]
    });
  }
};
