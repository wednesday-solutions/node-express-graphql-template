module.exports = {
  up: queryInterface => {
    const range = require('lodash/range');
    const arr = range(1, 500).map((value, index) => ({
      student_id: 1 + parseInt(Math.random() * 1999),
      subject_id: 1 + parseInt(Math.random() * 1999)
    }));
    return queryInterface.bulkInsert('student_subjects', arr, {});
  },
  down: queryInterface => queryInterface.bulkDelete('student_subjects', null, {})
};
