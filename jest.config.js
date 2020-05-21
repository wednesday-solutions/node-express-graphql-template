module.exports = {
    setupFilesAfterEnv: ['./jest.setup.js'],
    clearMocks: true,
    restoreMocks: true,
    resetMocks: true,
    globals: {
        server: null
    }
};
