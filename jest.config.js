module.exports = {
  testEnvironment: 'node',
  setupFiles: ['./jest.setup.js'],
  collectCoverageFrom: ['**/server/**', '!**/node_modules/**', '!**/dist/**'],
  testPathIgnorePatterns: ['<rootDir>/dist/'],
  moduleNameMapper: {
    'server(.*)$': '<rootDir>/server/$1',
    '@(database|gql|daos)(.*)$': '<rootDir>/server/$1/$2',
    '@(utils)(.*)$': '<rootDir>/server/$1/$2'
  }
};
