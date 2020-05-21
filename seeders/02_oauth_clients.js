module.exports = {
    up: queryInterface => {
        const range = require('lodash/range');
        const arr = range(1, 6).map((value, index) => ({
            client_id: `TEST_CLIENT_ID_${index}`,
            client_secret: 'TEST_CLIENT_SECRET',
            grant_type: 'CLIENT_CREDENTIALS'
        }));
        return queryInterface.bulkInsert('oauth_clients', arr, {});
    },
    down: queryInterface => queryInterface.bulkDelete('oauth_clients', null, {})
};
