module.exports = {
    up: queryInterface => {
        const { SCOPE_TYPE } = require('../utils/seedData');
        const arr = Object.values(SCOPE_TYPE).map((scope, index) => ({
            oauth_client_id: index + 1,
            scope,
            created_at: new Date()
        }));

        return queryInterface.bulkInsert('oauth_client_scopes', arr, {});
    },
    down: queryInterface =>
        queryInterface.bulkDelete('oauth_client_scopes', null, {})
};
