import db from '@database/models';
import { checkPassword, createPassword } from '@utils/passwordUtils';

export const getUserBySignIn = async (email, password) => {
  const user = await db.users.findOne({
    where: { email }
  });

  if (await checkPassword(password, user.password)) {
    return user;
  } else {
    throw Error('Invalid Password');
  }
};

export const createUserBySignup = async (firstName, lastName, email, password) => {
  const encryptedPassword = await createPassword(password);
  return await db.users.create({
    firstName,
    lastName,
    email,
    password: encryptedPassword
  });
};
