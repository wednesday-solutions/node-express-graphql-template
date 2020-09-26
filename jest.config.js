module.exports = {
  testEnvironment: 'node',
  setupFiles: ['./jest.setup.js'],
  collectCoverageFrom: ['**/server/**', '!**/node_modules/**', '!**/dist-server/**'],
  testPathIgnorePatterns: ['<rootDir>/dist-server/']
};
