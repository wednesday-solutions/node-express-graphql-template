module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./jest.setup.js'],
  collectCoverageFrom: ['**/server/**', '!**/node_modules/**', '!**/dist/**'],
  testPathIgnorePatterns: ['<rootDir>/dist/'],
  moduleNameMapper: {
    'server(.*)$': '<rootDir>/server/$1',
    '@(database|gql)(.*)$': '<rootDir>/server/$1/$2',
    '@(utils)(.*)$': '<rootDir>/server/$1/$2'
  }
};
