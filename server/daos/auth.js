import { Op } from 'sequelize';
import db from '@database/models';
const bcrypt = require('bcrypt');

export const createPassword = password =>
    new Promise((resolve, reject) =>
        bcrypt.hash(password, 10, (err, hash) =>
            err ? reject(err) : resolve(hash)
        )
    );

export const checkPassword = (password, hash) =>
    new Promise((resolve, reject) =>
        bcrypt.compare(password, hash, (err, result) =>
            err ? reject(err) : resolve(result)
        )
    );

export const getUserBySignIn = async (email, password) => {
  const user = await db.users.findOne({
    where: {email}
  });

  if(await checkPassword(password, user.password)) {
    return user;
  } else throw Error('Invalid Password');
};

export const createUserBySignup = async (firstName, lastName, email, password) => {
  const encryptedPassword = await createPassword(password);
  // console.log("encrypted",encryptedPassword)
  await db.users.create({
    firstName,
    lastName,
    email,
    password:encryptedPassword
  });
};
