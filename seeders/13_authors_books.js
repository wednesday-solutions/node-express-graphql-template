const range = require('lodash/range');

module.exports = {
  up: queryInterface => {
    const arr = range(1, 5).map((value, index) => ({
      author_id: index + 1,
      book_id: index + 1
    }));
    return queryInterface.bulkInsert('authors_books', arr, {});
  },
  down: queryInterface => queryInterface.bulkDelete('authors_books', null, {})
};
