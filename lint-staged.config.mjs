export default {
  '*': ['./.githooks/enforce-branch-names.sh'],
  '**/*.test.ts': ['npm run test:pre-commit'],
  './src/**/*.ts': ['prettier --write', 'eslint --fix'],
  './src/**/*.ts?(x)': () => 'npm run lint:ts',
  '*.{json,css,md,ts,tsx,scss,css,md}': ['prettier --write'],
};
