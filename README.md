[![TypeScript version][ts-badge]][typescript-32]
[![Node.js version][nodejs-badge]][nodejs]
[![APLv2][license-badge]][LICENSE]
[![Build Status][travis-badge]][travis-ci]
[![PRs Welcome][prs-badge]][prs]
[![Donate][donate-badge]][donate]

[![Watch on GitHub][github-watch-badge]][github-watch]
[![Star on GitHub][github-star-badge]][github-star]
[![Tweet][twitter-badge]][twitter]

# node-typescript-boilerplate

Minimalistic boilerplate to jump-start a [Node.js][nodejs] project in [TypeScript][typescript] [3.2][typescript-32].

What's included:

+ [TypeScript][typescript] [3.2][typescript-32],
+ [TSLint][tslint] with [Microsoft rules][tslint-microsoft-contrib],
+ [Jest][jest] unit testing and code coverage,
+ Type definitions for Node.js and Jest,
+ [Prettier][prettier] to enforce a consistent code style,
+ [NPM scripts for common operations](#available-scripts),
+ a simple example of TypeScript code and unit test,
+ .editorconfig for consistent file format.

## Quick start

This project is intended to be used with the latest Active LTS release of [Node.js][nodejs]. To start, just clone the repository with following commands:

```sh
git clone https://github.com/jsynowiec/node-typescript-boilerplate
cd node-typescript-boilerplate
npm install
```

or download and unzip current `master` branch:

```sh
wget https://github.com/jsynowiec/node-typescript-boilerplate/archive/master.zip -O node-typescript-boilerplate
unzip node-typescript-boilerplate.zip && rm node-typescript-boilerplate.zip
```

Now start adding your code in the `src` and unit tests in the `__tests__` directories. Have fun and build amazing things 🚀

### Unit tests in JavaScript

Writing unit tests in TypeScript can sometimes be troublesome and confusing. Especially when mocking dependencies and using spies.

This is **optional**, but if you want to learn how to write JavaScript tests for TypeScript modules, read the [corresponding wiki page][wiki-js-tests].

## Available scripts

+ `clean` - remove coverage data, Jest cache and transpiled files,
+ `build` - transpile TypeScript to ES6,
+ `build:watch` - interactive watch mode to automatically transpile source files,
+ `lint` - lint source files and tests,
+ `test` - run tests,
+ `test:watch` - interactive watch mode to automatically re-run tests

## License
Licensed under the APLv2. See the [LICENSE](https://github.com/jsynowiec/node-typescript-boilerplate/blob/master/LICENSE) file for details.

[ts-badge]: https://img.shields.io/badge/TypeScript-3.2-blue.svg
[nodejs-badge]: https://img.shields.io/badge/Node.js->=%2010.13-blue.svg
[nodejs]: https://nodejs.org/dist/latest-v10.x/docs/api/
[travis-badge]: https://travis-ci.org/jsynowiec/node-typescript-boilerplate.svg?branch=master
[travis-ci]: https://travis-ci.org/jsynowiec/node-typescript-boilerplate
[typescript]: https://www.typescriptlang.org/
[typescript-32]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-2.html
[license-badge]: https://img.shields.io/badge/license-APLv2-blue.svg
[license]: https://github.com/jsynowiec/node-typescript-boilerplate/blob/master/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg
[prs]: http://makeapullrequest.com
[donate-badge]: https://img.shields.io/badge/$-support-green.svg
[donate]: http://bit.ly/donate-js
[github-watch-badge]: https://img.shields.io/github/watchers/jsynowiec/node-typescript-boilerplate.svg?style=social
[github-watch]: https://github.com/jsynowiec/node-typescript-boilerplate/watchers
[github-star-badge]: https://img.shields.io/github/stars/jsynowiec/node-typescript-boilerplate.svg?style=social
[github-star]: https://github.com/jsynowiec/node-typescript-boilerplate/stargazers
[twitter]: https://twitter.com/intent/tweet?text=Check%20out%20this%20Node.js%20TypeScript%20boilerplate!%20https://github.com/jsynowiec/node-typescript-boilerplate%20%F0%9F%91%8D
[twitter-badge]: https://img.shields.io/twitter/url/https/jsynowiec/node-typescript-boilerplate.svg?style=social
[jest]: https://facebook.github.io/jest/
[tslint]: https://palantir.github.io/tslint/
[tslint-microsoft-contrib]: https://github.com/Microsoft/tslint-microsoft-contrib
[wiki-js-tests]: https://github.com/jsynowiec/node-typescript-boilerplate/wiki/Unit-tests-in-plain-JavaScript
[prettier]: https://prettier.io
