module.exports = {
    up: queryInterface => {
        const range = require('lodash/range');
        const arr = range(1, 20).map((value, index) => ({
            store_id: 1 + parseInt(Math.random() * 18),
            item_id: parseInt(1 + Math.random() * 20)
        }));
        return queryInterface.bulkInsert('store_items', arr, {});
    },
    down: queryInterface => queryInterface.bulkDelete('store_items', null, {})
};
