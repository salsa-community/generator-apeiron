var Generator = require('yeoman-generator');

const ora = require('ora');
const chalk = require('chalk');
const prompts = require('prompts');
const terminalLink = require('terminal-link');
const { info, warn } = require('prettycli');
const cheerio = require('cheerio');
const $ = cheerio.load('<h2 class="title">Hello world</h2>');
var beautify = require('gulp-beautify');
const fsreader = require('fs');
var inquirer = require('inquirer');
var dateFormat = require('dateformat');
const ModelHelper = require('./modelHelper');
const axios = require('axios');
const fs = require('fs');
const csv = require('csv-parser');
const Logger = require('../util/logger');
const String = require('../util/strings');
const Catalogos = require('../util/distribucion/constants');
const SalsaLogin = require('../util/SalsaLogin');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.option('prod');
    this.option('qa');
  }

  async writing() {
    let model = await ModelHelper.readModelFromCsv('proyectos-layout-v2.csv');
    console.log(JSON.stringify(model, null, 2));

    this.fs.copyTpl(this.templatePath('entity.model.ts.ejs'), this.destinationPath('demo/proyecto.model.ts'), {
      entity: model.proyecto,
    });

    // this.fs.copyTpl(this.templatePath('entity.model.java.ejs'), this.destinationPath('demo/Proyecto.java'), {
    //   entity: model,
    // });

    // this.fs.copyTpl(this.templatePath('entity.model.dto.java.ejs'), this.destinationPath('demo/ProyectoDTO.java'), {
    //   entity: model,
    // });
  }
};
