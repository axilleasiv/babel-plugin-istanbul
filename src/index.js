'use strict';

const { relative, dirname } = require('path');
const t = require('@babel/types');
const { programVisitor } = require('@achil/istanbul-lib-instrument');

function isReplFile(state) {
  var dir = dirname(state.opts.fileName);
  var rel = relative(dir, state.file.opts.filename);

  if (state.opts.included.indexOf(rel) !== -1) {
    state.rel = rel;
    return true;
  }

  return false;
}

module.exports = function() {
  return {
    visitor: {
      Program: {
        enter(path, state) {
          if (!isReplFile(state)) {
            path.skip();
            return;
          }

          this.__dv__ = null;
          this.__dv__ = programVisitor(t, state.rel, {
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
