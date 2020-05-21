module.exports = {
    up: queryInterface => {
        const range = require('lodash/range');
        const moment = require('moment');

        const arr = range(1, 6).map(value => ({
            oauth_client_id: value,
            access_token: require('uuid/v4')().replace(/-/g, ''),
            expires_in: 86400,
            expires_on: moment().format('YYYY-MM-DD HH:mm:ss'),
            created_at: new Date()
        }));
        return queryInterface.bulkInsert('oauth_access_tokens', arr, {});
    },
    down: queryInterface =>
        queryInterface.bulkDelete('oauth_access_tokens', null, {})
};
