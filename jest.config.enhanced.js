/**
 * Enhanced Jest Configuration
 * Optimized for 80%+ test coverage with performance monitoring
 */

export default {
  // ==================== ENVIRONMENT ====================
  testEnvironment: 'node',

  // Use native ESM support
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {},
  extensionsToTreatAsEsm: ['.js'],

  // ==================== TEST DISCOVERY ====================
  testMatch: [
    '**/tests/**/*.test.js',
    '**/tests/**/*.spec.js',
    '**/test-starter-files/**/*.test.js', // Include new boilerplate tests
  ],

  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/coverage/',
    '/.git/',
  ],

  // ==================== COVERAGE CONFIGURATION ====================
  collectCoverage: false, // Enable with --coverage flag

  collectCoverageFrom: [
    'scripts/**/*.js',
    'agents/**/*.js',
    '!scripts/hooks/**', // Exclude hooks
    '!**/node_modules/**',
    '!**/tests/**',
    '!**/test-starter-files/**',
    '!**/coverage/**',
    '!**/*.config.js',
    '!**/dist/**',
  ],

  // Progressive coverage thresholds (increase gradually)
  coverageThreshold: {
    global: {
      branches: 40,    // Week 1: 40% → Week 4: 80%
      functions: 40,   // Week 1: 40% → Week 4: 80%
      lines: 40,       // Week 1: 40% → Week 4: 80%
      statements: 40,  // Week 1: 40% → Week 4: 80%
    },

    // Critical modules with higher thresholds
    './scripts/orchestrator.js': {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
    './scripts/rabbitmq-client.js': {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
    './scripts/voting-system.js': {
      branches: 45,
      functions: 45,
      lines: 45,
      statements: 45,
    },

    // New modules needing coverage
    './scripts/monitor.js': {
      branches: 30,
      functions: 30,
      lines: 30,
      statements: 30,
    },
    './scripts/gamification/peer-rating.js': {
      branches: 30,
      functions: 30,
      lines: 30,
      statements: 30,
    },
  },

  // Coverage reporters
  coverageReporters: [
    'text',
    'text-summary',
    'html',
    'lcov',
    'json-summary',
    'cobertura', // For CI/CD integration
  ],

  coverageDirectory: 'coverage',

  // ==================== PERFORMANCE SETTINGS ====================
  testTimeout: 30000, // 30 seconds default timeout

  // Parallel execution optimization
  maxWorkers: '75%', // Use 75% of available CPU cores

  // Max concurrent test files per worker
  maxConcurrency: 5,

  // ==================== TEST EXECUTION ====================
  verbose: true,

  // Automatically clear mock calls and instances between tests
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,

  // Detect open handles and memory leaks
  detectOpenHandles: true,
  detectLeaks: false, // Enable for memory leak detection (slower)

  // Force exit after tests complete
  forceExit: true,

  // Fail tests on console errors
  errorOnDeprecated: true,

  // ==================== WATCH MODE CONFIGURATION ====================
  watchPathIgnorePatterns: [
    '/node_modules/',
    '/coverage/',
    '/dist/',
    '/.git/',
  ],

  // Watch plugins for better developer experience
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],

  // ==================== REPORTERS ====================
  reporters: [
    'default',

    // JUnit reporter for CI/CD
    [
      'jest-junit',
      {
        outputDirectory: './coverage',
        outputName: 'junit.xml',
        classNameTemplate: '{classname}',
        titleTemplate: '{title}',
        ancestorSeparator: ' › ',
        usePathForSuiteName: true,
        addFileAttribute: true,
        includeConsoleOutput: true,
        includeShortConsoleOutput: false,
      },
    ],

    // HTML reporter for detailed test results
    [
      'jest-html-reporters',
      {
        publicPath: './coverage/html-report',
        filename: 'test-report.html',
        expand: true,
        pageTitle: 'AI Agent RabbitMQ - Test Report',
        logoImgPath: undefined,
        hideIcon: false,
        customInfos: [
          {
            title: 'Test Environment',
            value: process.env.NODE_ENV || 'development',
          },
          {
            title: 'Node Version',
            value: process.version,
          },
        ],
      },
    ],
  ],

  // ==================== SETUP FILES ====================
  setupFilesAfterEnv: [
    '<rootDir>/tests/setup/jest.setup.js', // Global test setup
  ],

  // Module directories
  moduleDirectories: ['node_modules', '<rootDir>'],

  // ==================== SNAPSHOT TESTING ====================
  snapshotSerializers: [],
  snapshotFormat: {
    escapeString: false,
    printBasicPrototype: false,
  },

  // ==================== BAIL CONFIGURATION ====================
  bail: process.env.CI ? 1 : 0, // Stop after first test failure in CI

  // ==================== GLOBALS ====================
  globals: {
    // Any global variables needed for tests
    __DEV__: true,
    __TEST__: true,
  },

  // ==================== TEST SEQUENCER ====================
  // Custom test sequencer for optimized test order
  testSequencer: '<rootDir>/tests/setup/test-sequencer.js',

  // ==================== NOTIFICATION ====================
  notify: false, // Enable desktop notifications
  notifyMode: 'failure-change', // Only notify on failure or status change

  // ==================== CUSTOM MATCHERS ====================
  setupFilesAfterEnv: ['<rootDir>/tests/setup/custom-matchers.js'],

  // ==================== CODE TRANSFORMATION CACHE ====================
  cache: true,
  cacheDirectory: '/tmp/jest-cache',

  // ==================== PROJECTS (for different test types) ====================
  projects: [
    {
      displayName: 'Unit Tests',
      testMatch: ['<rootDir>/tests/unit/**/*.test.js'],
      setupFilesAfterEnv: ['<rootDir>/tests/setup/unit.setup.js'],
    },
    {
      displayName: 'Integration Tests',
      testMatch: ['<rootDir>/tests/integration/**/*.test.js'],
      setupFilesAfterEnv: ['<rootDir>/tests/setup/integration.setup.js'],
      testTimeout: 60000, // Longer timeout for integration tests
    },
    {
      displayName: 'E2E Tests',
      testMatch: ['<rootDir>/tests/e2e/**/*.test.js'],
      setupFilesAfterEnv: ['<rootDir>/tests/setup/e2e.setup.js'],
      testTimeout: 120000, // Even longer timeout for E2E tests
      maxWorkers: 2, // Limit parallelism for E2E tests
    },
  ],

  // ==================== EXPERIMENTAL FEATURES ====================
  // Enable experimental features for better performance
  experimentalEsmSupport: true,

  // ==================== CUSTOM CONFIGURATION PER ENVIRONMENT ====================
  // Override settings based on environment
  ...(process.env.CI && {
    // CI-specific settings
    collectCoverage: true,
    coverageReporters: ['text', 'lcov', 'cobertura'],
    maxWorkers: 2,
    silent: true,
  }),

  ...(process.env.DEBUG && {
    // Debug mode settings
    verbose: true,
    bail: 0,
    detectLeaks: true,
    detectOpenHandles: true,
  }),
};