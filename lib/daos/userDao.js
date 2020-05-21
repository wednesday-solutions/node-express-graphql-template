import { users } from 'models';

export const findOneUser = userId =>
    users.findOne({
        attributes: ['id', 'first_name', 'last_name', 'email'],
        where: {
            id: userId
        },
        underscoredAll: false
    });

export const findAllUser = async (page, limit) => {
    const where = {};
    const totalCount = await users.count({ where });
    const allUsers = await users.findAll({
        attributes: ['id', 'first_name', 'last_name', 'email'],
        where,
        offset: (page - 1) * limit,
        limit
    });
    return { allUsers, totalCount };
};
