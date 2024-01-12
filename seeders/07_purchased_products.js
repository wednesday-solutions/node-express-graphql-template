const purchasedProducts = [
  {
    price: 808,
    product_id: 1,
    store_id: 1,
    discount: 100,
    delivery_date: '2024-01-12T06:49:10.749Z',
    created_at: '1994-10-24T06:49:10.749Z'
  }
];

module.exports = {
  up: queryInterface => {
    const faker = require('faker');
    const moment = require('moment');
    const range = require('lodash/range');
    const MAR_11_2022 = 1646981350749;
    const OCT_10_1994 = 782980686236;
    const arr = range(2, 10000).map((value, index) => {
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
    const newArr = purchasedProducts.concat(arr);
    return queryInterface.bulkInsert('purchased_products', newArr, {});
  },
  down: queryInterface => queryInterface.bulkDelete('purchased_products', null, {})
};
