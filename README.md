# node-typescript-boilerplate

Minimalistic boilerplate to quick-start Node.js development in TypeScript.

Provides a basic template for Node.js project that is preconfigured with:

+ TypeScript to ES6 transpilation,
+ TSLint linting with some basic rules, 
+ Mocha + Chai tests w/o transpilation,
+ nyc (Istanbul) coverage w/o transpilation,
+ Type definitions for Node, Mocha and Chai.

## Quick start

This project requires [Node.js](https://nodejs.org/) 6.2+ and [NPM](https://www.npmjs.com/). Make sure you have those installed. Then just type following commands:

```
git clone https://github.com/jsynowiec/node-typescript-boilerplate
cd node-typescript-boilerplate
npm install
```

## Available NPM scripts

+ `clean` - remove coverage report and transpiled files,
+ `compile` - transpile TS to ES6,
+ `watch` - watch source directory and transpile on change, 
+ `lint` - lint source files and tests,
+ `test` - run tests,
+ `test:coverage` - run tests and check coverage,

## License
MIT License. See the [LICENSE](https://github.com/jsynowiec/api-blueprint-boilerplate/blob/master/LICENSE) file.