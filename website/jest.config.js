export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^/smartgrind/(.*)$': '<rootDir>/public/$1',
  },
  testMatch: [
    '<rootDir>/tests/**/*.test.js',
  ],
  collectCoverageFrom: [
    'public/modules/**/*.js',
    'functions/**/*.js',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-environment-jsdom)/)',
  ],
};