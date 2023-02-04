module.exports = {
  // env: {
  //   'jest/globals': true,
  // },
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    // 'plugin:jest/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    // tsconfigRootDir: __dirname,
    project: ['./tsconfig.json', './tsconfig.eslint.json'],
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    // "@typescript-eslint",
    'filenames',
  ],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    'class-methods-use-this': 'warn',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    'no-use-before-define': 'off',
    'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
    'no-console': 1,
    indent: ['error', 4],
    semi: ['error', 'always'],
    'import/prefer-default-export': 'off',
    'import/no-unresolved': 'off',
    'import/extensions': 'off',
    'import/first': 'off',
    'import/order': 'error',
  },
};