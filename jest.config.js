module.exports = {
  testEnvironment: 'node',
  transform: {
    '.(ts|tsx)': '<rootDir>/preprocessor.js'
  },
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
  ],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(ts|js)x?$',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx,js,jsx}',
    '!src/**/*.d.ts',
  ],
};
