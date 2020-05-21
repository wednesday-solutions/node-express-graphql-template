module.exports = {
    up: queryInterface => {
        const { RESOURCE_TYPE } = require('../utils/seedData');
        const arr = Object.values(RESOURCE_TYPE).map((resource, index) => ({
            oauth_client_id: index + 1,
            resource_type: resource,
            resource_id: 1
        }));
        return queryInterface.bulkInsert('oauth_client_resources', arr, {});
    },
    down: queryInterface =>
        queryInterface.bulkDelete('oauth_client_resources', null, {})
};
