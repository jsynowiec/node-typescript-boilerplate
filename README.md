# node-typescript-boilerplate

[![Sponsor][sponsor-badge]][sponsor]
[![TypeScript version][ts-badge]][typescript-5-9]
[![Node.js version][nodejs-badge]][nodejs]
[![APLv2][license-badge]][license]
[![Build Status - GitHub Actions][gha-badge]][gha-ci]

👩🏻‍💻 Developer Ready: A comprehensive template. Works out of the box for most [Node.js][nodejs] projects.

🏃🏽 Instant Value: All basic tools included and configured:

- [TypeScript][typescript] [5.9][typescript-5-9]
- [ESM][esm]
- [ESLint][eslint] with some initial rules recommendation
- [Vitest][vitest] for fast unit testing and code coverage
- Type definitions for Node.js
- [Prettier][prettier] to enforce consistent code style
- NPM [scripts](#available-scripts) for common operations
- [EditorConfig][editorconfig] for consistent coding style
- Reproducible environments thanks to [Volta][volta]
- Example configuration for [GitHub Actions][gh-actions]
- Simple example of TypeScript code and unit test
- Basic [AGENTS.md][agents-md] guidelines for agents

🤲 Free as in speech: available under the APLv2 license.

## Getting Started

This project is intended to be used with the latest Active LTS release of [Node.js][nodejs].

### Use as a repository template

To start, just click the **[Use template][repo-template-action]** link (or the green button). Start adding your code in the `src` and unit tests in the `__tests__` directories.

### Clone repository

To clone the repository, use the following commands:

```sh
git clone https://github.com/jsynowiec/node-typescript-boilerplate
cd node-typescript-boilerplate
npm install
```

### Download latest release

Download and unzip the current **main** branch or one of the tags:

```sh
wget https://github.com/jsynowiec/node-typescript-boilerplate/archive/main.zip -O node-typescript-boilerplate.zip
unzip node-typescript-boilerplate.zip && rm node-typescript-boilerplate.zip
```

## Available Scripts

- `clean` - remove coverage data, cache and transpiled files,
- `prebuild` - lint source files and tests before building,
- `build` - transpile TypeScript to ES6,
- `build:watch` - interactive watch mode to automatically transpile source files,
- `lint` - lint source files and tests,
- `prettier` - reformat files,
- `test` - run tests,
- `test:watch` - interactive watch mode to automatically re-run tests
- `test:coverage` - run test and print out test coverage

## Additional Information

### Why include Volta

I recommend installing [Volta][volta-getting-started] and using it to manage your project's toolchain.

[Volta][volta] keeps track of your environment, ensuring the tools you use respect the settings of the project you're working on. This means you don't have to worry about changing your installed software when switching between projects.

### Why Vitest instead of Jest

I recommend using [Vitest][vitest] for unit and integration testing of your TypeScript code.

Vitest is generally faster than Jest, especially for large test suites. Additionally, Vitest has native support for ES modules, is easier to configure, and offers a better developer experience when used with TypeScript. For example, it simplifies working with mocks, spies, and types.

Nevertheless, the choice of specific tooling always depends on the project's specific requirements and characteristics.

### Why AGENTS.md over individual configs

The [AGENTS.md][agents-md] format has emerged as a community-driven standard, stewarded by the Agentic AI Foundation under the Linux Foundation. It is the closest thing to a universal config file, promoting consistency across AI coding tools.

The included guidelines are just an example. You should write your own, project-specific context and instructions.

### ES Modules

This template uses native [ESM][esm]. Make sure to read [this][nodejs-esm], and [this][ts47-esm] first. If your project requires CommonJS, you will have to [convert to ESM][sindresorhus-esm].

Please do not open issues for questions regarding CommonJS or ESM on this repo.

## Backers & Sponsors

Support this project by becoming a [sponsor][sponsor].

## License

Licensed under the APLv2. See the [LICENSE](https://github.com/jsynowiec/node-typescript-boilerplate/blob/main/LICENSE) file for details.

[ts-badge]: https://img.shields.io/badge/TypeScript-5.9-blue.svg
[nodejs-badge]: https://img.shields.io/badge/Node.js-24-blue.svg
[nodejs]: https://nodejs.org/dist/latest-v24.x/docs/api/
[gha-badge]: https://github.com/jsynowiec/node-typescript-boilerplate/actions/workflows/nodejs.yml/badge.svg
[gha-ci]: https://github.com/jsynowiec/node-typescript-boilerplate/actions/workflows/nodejs.yml
[typescript]: https://www.typescriptlang.org/
[typescript-5-9]: https://devblogs.microsoft.com/typescript/announcing-typescript-5-9/
[license-badge]: https://img.shields.io/badge/license-APLv2-blue.svg
[license]: https://github.com/jsynowiec/node-typescript-boilerplate/blob/main/LICENSE
[sponsor-badge]: https://img.shields.io/badge/♥-Sponsor-fc0fb5.svg
[sponsor]: https://github.com/sponsors/jsynowiec
[eslint]: https://github.com/eslint/eslint
[prettier]: https://prettier.io
[volta]: https://volta.sh
[volta-getting-started]: https://docs.volta.sh/guide/getting-started
[volta-tomdale]: https://twitter.com/tomdale/status/1162017336699838467
[gh-actions]: https://github.com/features/actions
[repo-template-action]: https://github.com/jsynowiec/node-typescript-boilerplate/generate
[esm]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
[sindresorhus-esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c
[nodejs-esm]: https://nodejs.org/docs/latest-v16.x/api/esm.html
[ts47-esm]: https://devblogs.microsoft.com/typescript/announcing-typescript-4-7/#esm-nodejs
[editorconfig]: https://editorconfig.org
[vitest]: https://vitest.dev
[agents-md]: https://agents.md