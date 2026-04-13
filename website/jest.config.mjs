export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: '<rootDir>/jest-environment-custom.mjs',
  testEnvironmentOptions: {
    url: 'http://localhost/smartgrind/',
    customExportConditions: ['node', 'node-addons'],
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.mjs'],
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^/smartgrind/(.*)$': '<rootDir>/public/$1',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.ts$': ['ts-jest', { useESM: true }],
    '^.+\\.(js|mjs)$': ['babel-jest'],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(jest-environment-jsdom|jose|marked|prismjs)/)',
  ],
  testMatch: [
    '<rootDir>/tests/**/*.test.(js|ts)',
  ],
  // COVERAGE: src/**/* includes lib/, renderers/, ui/, utils/, etc.
  // This ensures all source modules including new library code are tracked
  collectCoverageFrom: [
    'src/**/*.(js|ts)',
    'functions/**/*.(js|ts)',
  ],
  moduleFileExtensions: ['js', 'ts', 'mjs'],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  // Show test output for debugging
  verbose: true,
};
