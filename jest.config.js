module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./jest.setup.js'],
  collectCoverageFrom: [
    '**/server/**',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/server/database/models/**',
    '!**/server/utils/testUtils/**',
    '!**/server/utils/configureEnv.js',
    '!**server/middleware/logger/index.js'
  ],
  testPathIgnorePatterns: ['<rootDir>/dist/'],
  moduleNameMapper: {
    'server(.*)$': '<rootDir>/server/$1',
    '@(database|gql|middleware|daos)(.*)$': '<rootDir>/server/$1/$2',
    '@(utils)(.*)$': '<rootDir>/server/$1/$2'
  }
};
