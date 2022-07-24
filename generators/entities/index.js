let PrettyGenerator = require('../pretty-generator');

const ModelHelper = require('./modelHelper');
const { ONE_TO_MANY } = require('../../util/relationships-types');
const GeneratorProcessor = require('./processors/generatorProcessor');
module.exports = class extends PrettyGenerator {
  constructor(args, opts, features) {
    super(args, opts, features);
    this.option('prod');
    this.option('qa');
  }

  async writing() {
    let model = await ModelHelper.readModelFromCsv('proyectos-layout.csv');
    ModelHelper.resolveDefaultOutputPaths(model, 'mx.conacyt.crip.ms.proyectos', this);
    ModelHelper.addRelationship(model, 'proyecto', 'ministracion', ONE_TO_MANY, 'ministraciones');
    ModelHelper.addRelationship(model, 'proyecto', 'comentario_panel', ONE_TO_MANY, 'comentarios');
    ModelHelper.addRelationship(model, 'proyecto', 'aprobacion', ONE_TO_MANY, 'aprobaciones');
    ModelHelper.markAsEmbedded(model, 'ministracion', true);
    ModelHelper.markAsEmbedded(model, 'aprobacion', true);
    ModelHelper.markAsEmbedded(model, 'comentario_panel', true);
    GeneratorProcessor.doProcess(model, this, true);
  }
};
