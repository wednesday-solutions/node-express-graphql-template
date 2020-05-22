module.exports = {
    up: queryInterface => {
        const range = require('lodash/range');
        const arr = range(1, 2000).map((value, index) => ({
            supplier_id: 1 + parseInt(Math.random() * 1999),
            item_id: parseInt(Math.random() * 200000)
        }));
        return queryInterface.bulkInsert('supplier_items', arr, {});
    },
    down: queryInterface =>
        queryInterface.bulkDelete('supplier_items', null, {})
};
