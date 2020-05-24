module.exports = {
    up: queryInterface => {
        const range = require('lodash/range');
        const arr = range(1, 2000).map((value, index) => ({
            store_id: 1 + parseInt(Math.random() * 1999),
            item_id: 1 + parseInt(Math.random() * 999999)
        }));
        return queryInterface.bulkInsert('store_items', arr, {});
    },
    down: queryInterface => queryInterface.bulkDelete('store_items', null, {})
};
