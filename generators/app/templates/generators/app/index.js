'use strict';
const Generator = require('yeoman-generator');
const yosay = require('yosay');
const globby = require('globby');
const yoHelper = require('@jswork/yeoman-generator-helper');
const genp = require('@jswork/generator-prompts');
const prompts = genp(['scope', 'registry', 'project_name', 'description']);

module.exports = class extends Generator {
  async prompting() {
    this.log(yosay(`Welcome to the stunning $ "<%= project_name %>" generator!`));
    this.props = await this.prompt(prompts);
  }

  writing() {
    this.fs.copyTpl(globby.sync(this.templatePath('**'), { dot: true }), this.destinationPath(), {
      ...this.props,
      ctx: yoHelper.ctx,
    });
  }
};
