const { basename } = require('path');
const t = require('@babel/types');
const { programVisitor } = require('@achil/istanbul-lib-instrument');

module.exports = function() {
  return {
    visitor: {
      Program: {
        enter(path, state) {
          if (state.file.opts.filename !== state.opts.fileName) {
            return;
          }
          const name = basename(state.opts.fileName);

          this.__dv__ = null;
          this.__dv__ = programVisitor(t, name, {
            coverageVariable: state.opts.cvVar,
            cvIncreaseCb: state.opts.cvIncreaseCb,
            inputSourceMap: undefined
          });
          this.__dv__.enter(path);
        },
        exit(path) {
          if (!this.__dv__) {
            return;
          }
          this.__dv__.exit(path);
        }
      }
    }
  };
};
