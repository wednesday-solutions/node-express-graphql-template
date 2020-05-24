module.exports = {
    up: queryInterface => {
        const faker = require('faker');
        const range = require('lodash/range');
        const arr = range(1, 1000000).map((value, index) => ({
            name: faker.commerce.productName(),
            category: faker.commerce.department(),
            amount: parseFloat(faker.commerce.price()) * 100
        }));
        return queryInterface.bulkInsert('items', arr, {});
    },
    down: queryInterface => queryInterface.bulkDelete('items', null, {})
};
