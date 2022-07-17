const BaseGenerator = require('./base-generator');

var gulpif = require('gulp-if');
const prettier = require('gulp-prettier');

/**
 * This is the Generator base class.
 * This provides all the public API methods exposed via the module system.
 * The public API methods can be directly utilized as well using commonJS require.
 *
 * The method signatures in public API should not be changed without a major version change
 */
module.exports = class PrettyGenerator extends BaseGenerator {
  constructor(args, options, features) {
    super(args, options, features);
    prettier;
    this.queueTransformStream(gulpif(file => file.extname == '.java', prettier({ tabWidth: 4 })));
    this.queueTransformStream(gulpif(file => file.extname == '.ts', prettier({ singleQuote: true })));
    this.queueTransformStream(gulpif(file => file.extname == '.vue', prettier({ singleQuote: true })));
  }
};
