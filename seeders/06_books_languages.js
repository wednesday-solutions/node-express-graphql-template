const range = require('lodash/range');

module.exports = {
  up: queryInterface => {
    const arr = range(1, 20).map((value, index) => ({
      language_id: index + 1,
      book_id: index + 1
    }));
    return queryInterface.bulkInsert('books_languages', arr, {});
  },
  down: queryInterface => queryInterface.bulkDelete('books_languages', null, {})
};
