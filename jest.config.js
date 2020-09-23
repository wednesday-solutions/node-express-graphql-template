module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: ['**/server/**', '!**/node_modules/**', '!**/dist-server/**'],
  testPathIgnorePatterns: ['<rootDir>/dist-server/']
};
