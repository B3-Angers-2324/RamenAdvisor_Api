/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['dotenv/config'],
  collectCoverage: true,
  coverageReporters: ['text', 'html'],
  coverageDirectory: '<rootDir>/coverage/'
};