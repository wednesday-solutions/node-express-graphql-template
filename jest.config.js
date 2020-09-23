module.exports = {
  collectCoverageFrom: [
    './**/*.js',
    '!.eslintrc.js',
    '!jest.config.js',
    '!coverage/**/*.js',
    '!server/bin/*.js',
    '!dist/**/*.js',
    '!dist/**',
    '!node_modules/'
  ],
  setupFilesAfterEnv: [],
  clearMocks: true,
  restoreMocks: true,
  resetMocks: true,
  moduleNameMapper: {
    root: '<rootDir>',
    server: '<rootDir>/dist-server',
    utils: '<rootDir>/dist-server/utils',
    database: '<rootDir>/dist-server/database',
    gql: '<rootDir>/dist-server/gql'
  }
};
