export default {
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    "^.+\\.ts$": "ts-jest"
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.ts$',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
  ],
};
