var Generator = require('yeoman-generator');

const ModelHelper = require('./modelHelper');
const { ONE_TO_MANY } = require('../../util/relationships-types');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.option('prod');
    this.option('qa');
  }

  async writing() {
    let model = await ModelHelper.readModelFromCsv('proyectos-layout.csv');
    ModelHelper.addRelationship(model, 'proyecto', 'ministracion', ONE_TO_MANY, 'ministraciones');
    ModelHelper.addRelationship(model, 'proyecto', 'comentario_panel', ONE_TO_MANY, 'comentarios');
    ModelHelper.addRelationship(model, 'proyecto', 'aprobacion', ONE_TO_MANY, 'aprobaciones');

    this.fs.copyTpl(this.templatePath('entity.model.ts.ejs'), this.destinationPath('demo/proyecto.model.ts'), {
      entity: model.entities.proyecto,
    });

    this.fs.copyTpl(this.templatePath('model.json.ejs'), this.destinationPath('demo/model.json'), {
      model: JSON.stringify(model, null, 2),
    });

    // this.fs.copyTpl(this.templatePath('entity.model.java.ejs'), this.destinationPath('demo/Proyecto.java'), {
    //   entity: model,
    // });

    // this.fs.copyTpl(this.templatePath('entity.model.dto.java.ejs'), this.destinationPath('demo/ProyectoDTO.java'), {
    //   entity: model,
    // });
  }
};
