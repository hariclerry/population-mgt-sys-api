module.exports = {
  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  coverageDirectory: 'coverage',
 
  setupFilesAfterEnv: ['<rootDir>/config/test.json'],

  // The test environment that will be used for testing
  testEnvironment: 'node',

  timers: 'fake',
};