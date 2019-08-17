'use strict';

const t = require('@babel/types');

const { programVisitor } = require('@achil/istanbul-lib-instrument');

module.exports = function() {
  return {
    visitor: {
      Program: {
        enter(path, state) {
          this.__dv__ = null;
          this.__dv__ = programVisitor(t, state.opts.rel, {
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
