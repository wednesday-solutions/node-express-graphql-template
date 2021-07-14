import { Op } from 'sequelize';
import db from '@database/models';
// import bcrypt from 'bcrypt';

// export const createPassword = password =>
//     new Promise((resolve, reject) =>
//         bcrypt.hash(password, 10, (err, hash) =>
//             err ? reject(err) : resolve(hash)
//         )
//     );
//
// export const checkPassword = (password, hash) =>
//     new Promise((resolve, reject) =>
//         bcrypt.compare(password, hash, (err, result) =>
//             err ? reject(err) : resolve(result)
//         )
//     );

export const getUserBySignIn = async (email, password) => {
  await db.users.findOne({
    where: {
      [Op.and]: [{ email }, { password }]
    }
  });
};

export const createUserBySignup = async (firstName, lastName, email, password) => {
  await db.users.create({
    firstName,
    lastName,
    email,
    password
  });
};
