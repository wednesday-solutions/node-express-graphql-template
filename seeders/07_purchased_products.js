module.exports = {
  up: queryInterface => {
    const faker = require('faker');
    const moment = require('moment');
    const range = require('lodash/range');
    const MAR_11_2022 = 1646981350749;
    const OCT_10_1994 = 782980686236;
    const arr = range(1, 10000).map((value, index) => {
      const price = parseFloat(faker.commerce.price()) * 100;
      return {
        price,
        product_id: 1 + parseInt(Math.random() * 1999),
        store_id: 1 + parseInt(Math.random() * 1999),
        discount: parseInt(price / (Math.random() * 100)),
        delivery_date: moment(MAR_11_2022 + 86400000 * index).format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
        created_at: moment(OCT_10_1994 + 86400000 * index).format('YYYY-MM-DDTHH:mm:ss.SSSZ')
      };
    });
    return queryInterface.bulkInsert('purchased_products', arr, {});
  },
  down: queryInterface => queryInterface.bulkDelete('purchased_products', null, {})
};
