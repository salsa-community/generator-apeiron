'use strict';

const EntityProcessor = require('./entitiesProcessor');

module.exports = class GeneratorProcessor {
  static doProcess(model, generator, printModel) {
    EntityProcessor.doProcess(model, generator);
    if (printModel) {
      generator.fs.copyTpl(generator.templatePath('model.json.ejs'), generator.destinationPath('demo/model.json'), {
        model: JSON.stringify(model, null, 2),
      });
    }
  }
};
