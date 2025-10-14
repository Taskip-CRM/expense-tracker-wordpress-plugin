/**
 * Jest Configuration for ERG Testing
 */
module.exports = {
  // Test environment
  testEnvironment: 'jsdom',

  // Setup files
  setupFilesAfterEnv: [
    '<rootDir>/src/test-utils/setupTests.ts'
  ],

  // Module name mapping
  moduleNameMapping: {
    // Handle CSS imports
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',

    // Handle image imports
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/src/test-utils/__mocks__/fileMock.js',

    // Path mapping to match tsconfig.json
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@stores/(.*)$': '<rootDir>/src/stores/$1',
    '^@types/(.*)$': '<rootDir>/src/types/$1',
    '^@styles/(.*)$': '<rootDir>/src/styles/$1'
  },

  // Transform configuration
  transform: {
    '^.+\\.(ts|tsx)$': 'babel-jest',
    '^.+\\.(js|jsx)$': 'babel-jest'
  },

  // File extensions to consider
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json'
  ],

  // Test match patterns
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.(ts|tsx|js|jsx)',
    '<rootDir>/src/**/*.(test|spec).(ts|tsx|js|jsx)'
  ],

  // Ignore patterns
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/assets/',
    '<rootDir>/dist/'
  ],

  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.{ts,tsx,js,jsx}',
    '!src/**/*.d.ts',
    '!src/test-utils/**/*',
    '!src/**/__tests__/**/*',
    '!src/**/*.stories.{ts,tsx,js,jsx}',
    '!src/index.ts',
    '!src/react-globals.js'
  ],

  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },

  // Coverage reporters
  coverageReporters: [
    'text',
    'lcov',
    'html',
    'json-summary'
  ],

  // Coverage directory
  coverageDirectory: '<rootDir>/coverage',

  // Globals
  globals: {
    'ts-jest': {
      useESM: true,
      tsconfig: 'tsconfig.json'
    }
  },

  // Clear mocks between tests
  clearMocks: true,

  // Restore mocks after each test
  restoreMocks: true,

  // Verbose output
  verbose: true,

  // Test timeout
  testTimeout: 10000,

  // Error on deprecated features
  errorOnDeprecated: true,

  // Watch plugins
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname'
  ],

  // Max workers for parallel testing
  maxWorkers: '50%',

  // Cache directory
  cacheDirectory: '<rootDir>/node_modules/.cache/jest'
};