/**
 * Jest Configuration for Node.js ESM Projects
 * Compatible with NODE_OPTIONS=--experimental-vm-modules
 */

module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js', '**/tests/**/*.spec.js'],

  // ESM Support (package.json has "type": "module")
  transform: {},
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },

  // Coverage configuration
  collectCoverageFrom: [
    'scripts/**/*.js',
    'agents/**/*.js',
    '!scripts/hooks/**',
    '!**/node_modules/**',
    '!**/tests/**',
    '!**/coverage/**'
  ],

  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60
    }
  },

  coverageReporters: ['text', 'text-summary', 'html', 'lcov', 'json-summary'],

  testTimeout: 30000,
  verbose: true,
  detectOpenHandles: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,

  moduleDirectories: ['node_modules', '<rootDir>'],

  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: './coverage',
        outputName: 'junit.xml',
        classNameTemplate: '{classname}',
        titleTemplate: '{title}',
        ancestorSeparator: ' › ',
        usePathForSuiteName: true
      }
    ]
  ],

  maxWorkers: '50%',
  bail: process.env.CI ? 1 : 0
};
