<p align="center">
  <a href="https://www.useparagon.com/" target="blank"><img src="./static/paragon-banner.png" width="320" alt="Paragon Logo" /></a>
</p>

The [Paragon](https://www.useparagon.com/) Minimalistic Node.js + TypeScript boilerplate. Originally forked from [this repo](https://github.com/jsynowiec/node-typescript-boilerplate).

What's included:

+ [TypeScript](https://www.typescriptlang.org/) [3.6](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-6.html)
+ [TSLint](https://palantir.github.io/tslint/) with [Microsoft Rules](https://github.com/Microsoft/tslint-microsoft-contrib)
+ [Jest](https://jestjs.io/) unit testing and code coverage,
+ Type definitions for Node.js and Jest,
+ [Prettier](https://prettier.io/) to enforce a consistent code style,
+ NPM scripts for common operations,
+ .editorconfig for consistent file format.

## Quick start

This project is intended to be used with the latest Active LTS release of Node.js. To start, just clone the repository with following commands:

```sh
git clone https://github.com/useparagon/node-typescript-boilerplate
cd node-typescript-boilerplate
npm install
```

Copy the `example.env` file to a file called `.env` and add the configuration needed for the required services.

## Available scripts

+ `compile` - compile a Paragon server
+ `clean` - remove coverage data, Jest cache and transpiled files,
+ `build` - transpile TypeScript to ES6,
+ `build:watch` - interactive watch mode to automatically transpile source files,
+ `lint` - lint source files and tests,
+ `test` - run tests,
+ `test:watch` - interactive watch mode to automatically re-run tests