module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  globals: {
    marked: 'readonly',
    Prism: 'readonly',
  },
  extends: [
    'eslint:recommended',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'indent': ['error', 4],
    'linebreak-style': ['error', 'unix'],
    'quotes': ['error', 'single', { 'avoidEscape': true }],
    'semi': ['error', 'always'],
    'no-unused-vars': ['warn', { 'argsIgnorePattern': '^_', 'varsIgnorePattern': '^_' }],
    'no-console': ['off'], // Allow console in this codebase
    'prefer-const': ['error'],
    'no-var': ['error'],
    'no-useless-escape': ['error'],
    'no-control-regex': ['off'], // Allow control characters in regex for sanitization
  },
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/',
  ],
};