'use strict';

module.exports = class EntityProcessor {
  static doProcess(model, generator) {
    this.doProcessEntityModelTs(model, generator);
    this.doProcessModelJava(model, generator);
    this.doProcessModelDtoJava(model, generator);
    this.doProcessProjectVue(model, generator);
    //this.doProcessProyectoMapperTs(model, generator);
    //this.doProcessUtilTs(model, generator);
  }

  static doProcessEntityModelTs(model, generator) {
    for (let entityKey in model.entities) {
      let entity = model.entities[entityKey];
      generator.fs.copyTpl(
        generator.templatePath('entities/entity.model.ts.ejs'),
        `/home/daniel/projects/git/becas/distribucion/gateway/${model.out.entityModelTs}/${entity.name.dashCase}.model.ts`,
        //generator.destinationPath(`${model.out.entityModelTs}/${entity.name.dashCase}.model.ts`),
        { entity: entity }
      );
    }
  }

  static doProcessModelJava(model, generator) {
    for (let entityKey in model.entities) {
      let entity = model.entities[entityKey];
      generator.fs.copyTpl(
        generator.templatePath('entities/entity.model.java.ejs'),
        `/home/daniel/projects/git/becas/distribucion/proyectos-ms/${model.out.modelJava}/${entity.name.pascalCase}.java`,
        //generator.destinationPath(`${model.out.modelJava}/${entity.name.pascalCase}.java`),
        { entity: entity }
      );
    }
  }

  static doProcessModelDtoJava(model, generator) {
    for (let entityKey in model.entities) {
      let entity = model.entities[entityKey];
      generator.fs.copyTpl(
        generator.templatePath('entities/entity.model.dto.java.ejs'),
        `/home/daniel/projects/git/becas/distribucion/proyectos-ms/${model.out.modelDtoJava}/${entity.name.pascalCase}DTO.java`,
        //generator.destinationPath(`${model.out.modelDtoJava}/${entity.name.pascalCase}DTO.java`),
        { entity: entity }
      );
    }
  }

  static doProcessProjectVue(model, generator) {
    generator.fs.copyTpl(
      generator.templatePath('project.vue.ejs'),
      `/home/daniel/projects/git/becas/distribucion/gateway/src/main/webapp/app/components/proyecto-edit/proyecto-edit.vue`,
      //generator.destinationPath('src/main/webapp/app/components/proyecto-edit/proyecto-edit.vue'),
      { entity: model.entities.proyecto }
    );
  }

  static doProcessUtilTs(model, generator) {
    generator.fs.copyTpl(generator.templatePath('util.ts.ejs'), generator.destinationPath(`demo/util.ts`), {
      entity: model.entities.proyecto,
    });
  }

  static doProcessProyectoMapperTs(model, generator) {
    generator.fs.copyTpl(generator.templatePath('proyecto.mapper.ts.ejs'), generator.destinationPath(`demo/proyecto.mapper.ts`), {
      entity: model.proyecto,
    });
  }
};
