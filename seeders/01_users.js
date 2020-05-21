module.exports = {
    up: queryInterface => {
        const arr = [
            {
                first_name: 'Sharan',
                last_name: 'Salian',
                email: 'sharan@wednesday.is'
            },
            {
                first_name: 'mac',
                last_name: 'mac',
                email: 'mac@wednesday.is'
            }
        ];
        return queryInterface.bulkInsert('users', arr, {});
    },
    down: queryInterface => queryInterface.bulkDelete('users', null, {})
};
