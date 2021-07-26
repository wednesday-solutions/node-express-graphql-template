import { db } from '@server';
import { checkPassword, createPassword } from '@utils/passwordUtils';

export const getUserBySignIn = async (email, password) => {
  const user = await db.users.findOne({
    where: { email }
  });

  if (checkPassword(password, user.password)) {
    return user;
  } else {
    throw Error('Invalid Password');
  }
};

export const createUserBySignup = async (firstName, lastName, email, password) => {
  const encryptedPassword = createPassword(password);
  return await db.users.create({
    firstName,
    lastName,
    email,
    password: encryptedPassword
  });
};
