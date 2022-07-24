'use strict';

module.exports = class FrontEndProcessor {
  static doProcess(model, generator) {
    this.doProcessEntityModelTs(model, generator);
    this.doProcessModelJava(model, generator);
    this.doProcessModelDtoJava(model, generator);
  }
};
