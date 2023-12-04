# node-typescript-boilerplate

[![TypeScript version][ts-badge]][typescript-5-1]
[![Node.js version][nodejs-badge]][nodejs]
[![Build Status - GitHub Actions][gha-badge]][gha-ci]

🏃🏽 Node.js template repository with the following tooling configured:

- [TypeScript][typescript] [5.1][typescript-5-1]
- [ESM][esm]
- [ESLint][eslint] with some initial rules recommendation
- [Jest][jest] for fast unit testing and code coverage
- Type definitions for Node.js and Jest
- [Prettier][prettier] to enforce consistent code style
- NPM [scripts](#available-scripts) for common operations
- [EditorConfig][editorconfig] for consistent coding style
- SRC based relative paths using the `@` symbol
- Reproducible environments thanks to [Volta][volta]
- Example configuration for [GitHub Actions][gh-actions]
- Simple example of TypeScript code and unit test

## Getting Started

This project is intended to be used with the latest Active LTS release of [Node.js][nodejs].

### Use as a repository template

To start, just click the **[Use template][repo-template-action]** link (or the green button). Start adding your code in the `src` and unit tests in the `__tests__` or local `.test.ts` files.

### Clone repository

To clone the repository, use the following commands:

```sh
git clone https://github.com/The-Everyone-Project/node-typescript-boilerplate
cd node-typescript-boilerplate
npm install
```

### Download latest release

Download and unzip the current **main** branch or one of the tags:

```sh
wget https://github.com/The-Everyone-Project/node-typescript-boilerplate/archive/main.zip -O node-typescript-boilerplate.zip
unzip node-typescript-boilerplate.zip && rm node-typescript-boilerplate.zip
```

## Available Scripts

- `start` - run the node server in production mode (alias for server:prod).
- `dev` - run the server in dev mode with watch enabled for the server and for TypeScript.
- `server` - run the server in normal mode.
- `server:prod` - run the server in production mode.
- `server:dev` - run the server in dev mode with watch enabled.
- `clean` - delete the build, coverage, and tmp directories.
- `prebuild` - lint source files and tests before building.
- `build` - transpile TypeScript to ES6 and replace any @ paths.
- `build:watch` - interactive watch mode to automatically transpile source files.
- `build:release` - clean and build with release ts config.
- `test` - run tests.
- `test:pre-commit` - runs pre-commit tests.
- `test:watch` - interactive watch mode to automatically watch for test changes.
- `prettier` - reformats the code following prettier rules.
- `lint` - lint source files and tests.
- `lint:ts` - checks the ts without emitting files.
- `lint:strict` - runs prettier, eslint and ts lint.
- `pre-commit` - runs lint-staged.
- `prepare` - installs husky to handle the pre-commit tasks.

## Additional Information

### Why include Volta

[Volta][volta]'s toolchain always keeps track of where you are, it makes sure the tools you use always respect the settings of the project you're working on. This means you don't have to worry about changing the state of your installed software when switching between projects. For example, it's [used by engineers at LinkedIn][volta-tomdale] to standardize tools and have reproducible development environments.

I recommend to [install][volta-getting-started] Volta and use it to manage your project's toolchain.

### ES Modules

This template uses native [ESM][esm].

[ts-badge]: https://img.shields.io/badge/TypeScript-5.1-blue.svg
[nodejs-badge]: https://img.shields.io/badge/Node.js->=%2018.12-blue.svg
[nodejs]: https://nodejs.org/dist/latest-v18.x/docs/api/
[gha-badge]: https://github.com/The-Everyone-Project/node-typescript-boilerplate/actions/workflows/nodejs.yml/badge.svg
[gha-ci]: https://github.com/The-Everyone-Project/node-typescript-boilerplate/actions/workflows/nodejs.yml
[typescript]: https://www.typescriptlang.org/
[typescript-5-1]: https://devblogs.microsoft.com/typescript/announcing-typescript-5-1/
[jest]: https://facebook.github.io/jest/
[eslint]: https://github.com/eslint/eslint
[prettier]: https://prettier.io
[volta]: https://volta.sh
[volta-getting-started]: https://docs.volta.sh/guide/getting-started
[volta-tomdale]: https://twitter.com/tomdale/status/1162017336699838467?s=20
[gh-actions]: https://github.com/features/actions
[repo-template-action]: https://github.com/The-Everyone-Project/node-typescript-boilerplate/generate
[esm]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
[editorconfig]: https://editorconfig.org
