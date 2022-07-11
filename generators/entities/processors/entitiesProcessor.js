'use strict';

module.exports = class EntityProcessor {
  static doProcess(model, generator) {
    this.doProcessEntityModelTs(model, generator);
    this.doProcessModelJava(model, generator);
    this.doProcessModelDtoJava(model, generator);
  }

  static doProcessEntityModelTs(model, generator) {
    for (let entityKey in model.entities) {
      let entity = model.entities[entityKey];
      generator.fs.copyTpl(
        generator.templatePath('entity.model.ts.ejs'),
        generator.destinationPath(`demo/${entity.name.dashCase}.model.ts`),
        { entity: entity }
      );
    }
  }

  static doProcessModelJava(model, generator) {
    for (let entityKey in model.entities) {
      let entity = model.entities[entityKey];
      generator.fs.copyTpl(
        generator.templatePath('entity.model.java.ejs'),
        generator.destinationPath(`demo/${entity.name.pascalCase}.java`),
        { entity: entity }
      );
    }
  }

  static doProcessModelDtoJava(model, generator) {
    for (let entityKey in model.entities) {
      let entity = model.entities[entityKey];
      generator.fs.copyTpl(
        generator.templatePath('entity.model.dto.java.ejs'),
        generator.destinationPath(`demo/${entity.name.pascalCase}DTO.java`),
        { entity: entity }
      );
    }
  }
};
