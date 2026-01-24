export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.mjs'],
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^/smartgrind/(.*)$': '<rootDir>/public/$1',
  },
  transform: {
    '^.+\\.ts$': ['ts-jest', { useESM: true }],
    '^.+\\.(js|mjs)$': 'babel-jest',
  },
  testMatch: [
    '<rootDir>/tests/**/*.test.(js|ts)',
  ],
  collectCoverageFrom: [
    'public/modules/**/*.(js|ts)',
    'functions/**/*.(js|ts)',
  ],
  moduleFileExtensions: ['js', 'ts', 'mjs'],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-environment-jsdom|jose)/)',
  ],
};