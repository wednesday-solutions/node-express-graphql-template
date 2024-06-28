module.exports = {
  up: queryInterface => {
    const faker = require('faker');
    const range = require('lodash/range');
    const arr = range(1, 100).map((value, index) => {
      const createdBefore = parseInt(Math.random() * 1000);
      const crypto = require('crypto');
      const salt = crypto.randomBytes(16).toString('hex');
      const hashedPassword = `${salt}:${crypto.scryptSync('wednesdaySolutions', salt, 64).toString('hex')}`;
      return {
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        email: `mac+${index}@wednesday.is`,
        password: hashedPassword,
        created_at: faker.date.recent(createdBefore)
      };
    });
    return queryInterface.bulkInsert('users', arr, {});
  },
  down: queryInterface => queryInterface.bulkDelete('users', null, {})
};
