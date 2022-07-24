'use strict';

const String = require('../../util/strings');
const { warn } = require('prettycli');
const axios = require('axios');
const fs = require('fs');
const csv = require('csv-parser');

const Inflector = require('../inflector');

const moment = require('moment');
module.exports = class modelHelper {
  static toProyecto(p, spinner) {
    let proyecto = {};
    proyecto.id = String.normalizeId(p.convocatoria) + '-' + p.clave;
    proyecto.convocatoria = p.convocatoria;
    proyecto.titulo = p.titulo;
    proyecto.anno = p.anio;
    proyecto.clave = this.resolveInteger(p.clave);
    proyecto.fondo = String.normalize(p.fondo);
    proyecto.sujetoApoyo = String.normalize(p.sujeto);
    proyecto.montoAutorizado = this.resolveDouble(p.monto);
    proyecto.estatus = p.estatus;
    proyecto.etapa = p.etapa;
    proyecto.area = p.area;
    proyecto.responsableTecnico = p.rt;
    proyecto.responsableAdministrativo = p.ra;
    proyecto.representanteLegal = p.rl;
    proyecto.objetivo = p.objetivo;
    return proyecto;
  }

  static resolveInteger(value) {
    return parseInt(value);
  }

  static resolveDouble(value) {
    return parseFloat(value);
  }

  static split(id, string, spinner, validate, modulo) {
    if (string) {
      const elements = string;
      for (let index = 0; index < elements.length; index++) {
        elements[index] = String.normalize(elements[index]);
        if (!validate.includes(elements[index])) {
          this.log.info(',' + modulo + ',' + id + ',' + elements[index]);
          spinner.fail(chalk.green.bold(modulo + '>' + elements[index] + '<') + chalk.green('CATALOG NOT FOUND'));
        }
      }
      return elements;
    } else {
      return [];
    }
  }

  static resolveBoolean(element) {
    if (element) {
      return element === 1 || element === '1';
    } else {
      return null;
    }
  }

  static wait(ms) {
    var start = Date.now(),
      now = start;
    while (now - start < ms) {
      now = Date.now();
    }
  }

  static sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }

  static addRelationship(model, leftEntity, rightEntity, type, name) {
    let relationship = { to: model.entities[rightEntity], type: type, name: this.resolveCommonNames(name) };
    model.entities[leftEntity].relationships.push(relationship);
  }

  static markAsEmbedded(model, entityName) {
    model.entities[entityName].isEmbedded = true;
  }

  static resolveDefaultOutputPaths(model, packageName, generator) {
    let packageNameWithSlash = packageName.replace(/\./g, '/');
    model.out = {};
    model.out.vueEntities = 'src/main/webapp/app/entities/proyectosMs';
    model.out.entityModelTs = 'src/main/webapp/app/shared/model/proyectosMs';
    model.out.dtos = 'src/main/webapp/app/shared/model/msPerfil';
    model.out.modelJava = `src/main/java/${packageNameWithSlash}/domain`;
    model.out.modelDtoJava = `src/main/java/${packageNameWithSlash}/service/dto`;
    model.out.apiPath = 'api.yml';
    this.addPackage(model, packageName);
  }

  static addPackage(model, packageName) {
    for (let entityKey in model.entities) {
      model.entities[entityKey].package = packageName;
    }
  }

  static readModelFromCsv(filePath, generator) {
    let model = { entities: {} };
    return new Promise(resolve => {
      fs.createReadStream(filePath)
        .pipe(csv({ mapHeaders: ({ header }) => String.normalize(String.toCamelCase(header)) }))
        .on('data', row => {
          if (!model.entities[row.objeto]) {
            model.entities[row.objeto] = this.createEntity(row.objeto);
          }
          model.entities[row.objeto].properties.push(this.createProperty(row));
        })
        .on('end', function () {
          resolve(model);
        });
    });
  }

  static createEntity(entityName) {
    return {
      title: String.toPascalCase(entityName),
      name: this.resolveCommonNames(entityName),
      path: '',
      properties: [],
      relationships: [],
      type: 'object',
      isEmbedded: false,
    };
  }

  static createProperty(row) {
    let property = this.resolveCommonNames(row.nombreCamposPantalla);
    property.multiplicidad = this.resolveMultiplicidad(row.multiplicidad);
    property.frontEndType = this.resolveFrontEndType(row.tipo);
    property.backEndType = this.resolveBackEndType(row.tipo);
    property.description = row.descripcion;
    property.title = row.nombreDeVariable;
    property.etapa = row.etapa;
    property.estatus = row.estatus;
    property.orden = row.orden;
    property.catalog = row.catalogo;
    property.validations = {};
    property.validations.max = row.max;
    property.validations.catalogo = row.catalogo;
    property.validations.regexp = row.regExp;
    return property;
  }

  static resolveCommonNames(name) {
    return {
      plural: Inflector.pluralize(name),
      camelCase: String.toCamelCase(name),
      dashCase: String.toDashCase(name),
      pascalCase: String.toPascalCase(name),
      snakeCase: String.toSnakeCase(name),
    };
  }

  static resolveFrontEndType(type) {
    if (type.toUpperCase() == 'DATE') {
      return 'Date';
    }
    // TODO review if Double and Integer are the dame for number in front end
    if (type.toUpperCase() == 'DOUBLE' || type.toUpperCase() == 'INTEGER') {
      return 'number';
    }

    return 'string';
  }

  static resolveBackEndType(type) {
    if (type.toUpperCase() == 'DATE') {
      return 'Instant';
    } else if (type.toUpperCase() == 'STRING') {
      return 'String';
    } else if (type.toUpperCase() == 'INTEGER') {
      return 'Integer';
    } else if (type.toUpperCase() == 'BOOLEAN') {
      return 'Boolean';
    } else if (type.toUpperCase() == 'DOUBLE') {
      return 'Double';
    }
    return type;
  }

  static resolveMultiplicidad(multiplicidad) {
    if (multiplicidad == '0 .. 0..*' || multiplicidad == '0..*') {
      return 'many';
    } else {
      return 'one';
    }
  }

  static loadProyectos(context) {
    fs.readdir('cargas/proyectos/partes', (err, files) => {
      try {
        const spinner = ora({ text: 'subiendo proyectos...', interval: 80 });
        spinner.start();
        spinner.info(chalk.green.bold('Running on [' + context.enviroment + ']'));
        let that = this;
        for (let index = 0, j = 0; index < files.length - 2; index++, j++) {
          let part = index.toLocaleString('en-US', {
            minimumIntegerDigits: 4,
            useGrouping: false,
          });

          setTimeout(() => {
            spinner.succeed(chalk.green.bold('PARTE - ') + chalk.green(part));
            fs.createReadStream('cargas/proyectos/partes/sh_part_' + part)
              .pipe(csv())
              .on('data', m => {
                let proyecto = that.toProyecto(m, spinner);
                axios
                  .patch(context.serviceUrl + '/api/proyectos/' + proyecto.id, proyecto, context.config)
                  .then(response => {
                    spinner.succeed(chalk.green.bold('updated - ') + chalk.green(response.data.id));
                  })
                  .catch(error => {
                    axios
                      .post(context.serviceUrl + '/api/proyectos', proyecto, context.config)
                      .then(response => {
                        spinner.succeed(chalk.green.bold('created - ') + chalk.green(response.data.id));
                      })
                      .catch(errorCreated => {
                        spinner.fail(chalk.green.bold('ups - ' + proyecto.id + ': ') + chalk.green(errorCreated));
                      });
                  });
              })
              .on('end', function () {
                spinner.succeed('finalización');
              });
          }, 20000 * j);
        }
      } catch (error) {
        warn(error);
      }
    });
  }
};
