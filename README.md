# node-typescript-boilerplate

[![Sponsor][sponsor-badge]][sponsor]
[![TypeScript version][ts-badge]][typescript-6-0]
[![Node.js version][nodejs-badge]][nodejs]
[![APLv2][license-badge]][license]
[![Build Status - GitHub Actions][gha-badge]][gha-ci]

A modern Node.js TypeScript starter template for building backend services, CLIs, workers, APIs, and libraries with a clean, production-ready toolchain.

This boilerplate is intentionally small, strict, and boring: no framework lock-in, no unnecessary runtime dependencies, and no hidden magic. Clone it, click Use template, or fork it when you want a reliable TypeScript foundation for a new Node.js project.

## What's included

- [TypeScript][typescript] [6][typescript-6-0] with strict, modern configuration
- Native [ESM][esm] support
- [Node.js][nodejs] 24 runtime target
- [Vitest][vitest] for fast unit tests and coverage
- [ESLint][eslint] and typescript-eslint for static analysis
- [Prettier][prettier] and EditorConfig for consistent formatting
- [GitHub Actions][gh-actions] CI workflow
- [Mise][mise] for reproducible local toolchains
- Minimal example source code and unit test
- [AGENTS.md][agents-md] with project guidance for AI coding agents such as GitHub Copilot, Claude Code, Codex-style agents, and other agentic development tools

### AI coding agent ready

This repository includes `AGENTS.md`, giving coding agents clear instructions about TypeScript style, testing expectations, Node.js conventions, dependency policy, and verification steps.

## Good fit for

- Starting a new Node.js + TypeScript backend
- Creating a framework-free TypeScript service
- Building a CLI, worker, API, job processor, or library
- Using Vitest instead of Jest
- Using native ESM instead of CommonJS
- Giving AI coding agents clear project instructions from day one

## Why this template?

Most starters are either too empty or too opinionated. This one gives you the boring essentials: TypeScript, linting, formatting, testing, CI, reproducible tooling, and agent instructions — without forcing Express, NestJS, Fastify, serverless tooling, databases, ORMs, or deployment platforms on you.

⭐ If this template saves you setup time, please star the repo to help others discover it.

## What this is not

This template does not include Express, NestJS, Fastify, serverless deployment, databases, ORMs, authentication, Docker, or cloud-specific configuration. It is a clean foundation you can build on.

## Getting started

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

## Available scripts

- `start` - run the built application,
- `clean` - remove coverage, build, and tmp directories,
- `prebuild` - lint and type-check before building,
- `check-types` - type-check without emitting output,
- `build` - transpile TypeScript to ES2024,
- `build:watch` - interactive watch mode to automatically transpile source files,
- `build:release` - clean and transpile for release (no source maps, comments removed),
- `lint` - lint source files and tests,
- `test` - run tests,
- `test:coverage` - run tests with coverage reporting,
- `test:watch` - interactive watch mode to automatically re-run tests,
- `prettier` - reformat source files,
- `prettier:check` - check source file formatting without modifying

## Additional information

### Why include Mise

I recommend installing [Mise][mise-getting-started] and using it to manage your project's toolchain and environment.

[Mise][mise] keeps track of your environment, ensuring the tools you use respect the settings of the project you're working on. This means you don't have to worry about changing your installed software when switching between projects.

> [!NOTE]
> This project previously used [Volta](https://volta.sh) for toolchain management. Volta is no longer maintained (see [volta-cli/volta#2080](https://github.com/volta-cli/volta/issues/2080)), so it was replaced with Mise, which the Volta maintainers recommend.

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

### Why include `tslib`

TypeScript inlines helper functions (e.g. for `async`/`await`, spread, destructuring) into every output file that needs them, and `importHelpers: true` plus `tslib` makes all files share a single imported copy instead, deduplicating repeated runtime code across the build.

## Sponsor

Support this project by becoming a [sponsor][sponsor].

## License

Licensed under the APLv2. See the [LICENSE](https://github.com/jsynowiec/node-typescript-boilerplate/blob/main/LICENSE) file for details.

[ts-badge]: https://img.shields.io/badge/TypeScript-6.0-blue.svg
[nodejs-badge]: https://img.shields.io/badge/Node.js-24-blue.svg
[nodejs]: https://nodejs.org/dist/latest-v24.x/docs/api/
[gha-badge]: https://github.com/jsynowiec/node-typescript-boilerplate/actions/workflows/nodejs.yml/badge.svg
[gha-ci]: https://github.com/jsynowiec/node-typescript-boilerplate/actions/workflows/nodejs.yml
[typescript]: https://www.typescriptlang.org/
[typescript-6-0]: https://devblogs.microsoft.com/typescript/announcing-typescript-6-0/
[license-badge]: https://img.shields.io/badge/license-APLv2-blue.svg
[license]: https://github.com/jsynowiec/node-typescript-boilerplate/blob/main/LICENSE
[sponsor-badge]: https://img.shields.io/badge/♥-Sponsor-fc0fb5.svg
[sponsor]: https://github.com/sponsors/jsynowiec
[eslint]: https://github.com/eslint/eslint
[prettier]: https://prettier.io
[mise]: https://mise.jdx.dev
[mise-getting-started]: https://mise.jdx.dev/getting-started.html
[gh-actions]: https://github.com/features/actions
[repo-template-action]: https://github.com/jsynowiec/node-typescript-boilerplate/generate
[esm]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
[sindresorhus-esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c
[nodejs-esm]: https://nodejs.org/docs/latest-v16.x/api/esm.html
[ts47-esm]: https://devblogs.microsoft.com/typescript/announcing-typescript-4-7/#esm-nodejs
[editorconfig]: https://editorconfig.org
[vitest]: https://vitest.dev
[agents-md]: https://agents.md
