import db from '@database/models';
import { checkPassword, createPassword } from '@utils/passwordUtils';

export const getUserByEmailPassword = async (email, password) => {
  const user = await db.users.findOne({
    where: { email }
  });

  if (!user) {
    throw Error('Invalid username/password');
  }
  if (await checkPassword(password, user.password)) {
    return user;
  } else {
    throw Error('Invalid username/password');
  }
};

export const createUserBySignup = async (firstName, lastName, email, password) => {
  const encryptedPassword = createPassword(password);
  return db.users.create({
    firstName,
    lastName,
    email,
    password: encryptedPassword
  });
};
