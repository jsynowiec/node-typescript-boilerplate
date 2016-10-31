// https://github.com/facebook/jest/blob/master/examples/typescript/preprocessor.js

const tsc = require('typescript');
const fs = require('fs');

const compilerOptions = JSON.parse(fs.readFileSync('./tsconfig.json')).compilerOptions;

module.exports = {
  process(src, path) {
    if (path.endsWith('.ts') || path.endsWith('.tsx')) {
      return tsc.transpile(
        src,
        compilerOptions,
        path,
        []
      );
    }
    return src;
  },
};
