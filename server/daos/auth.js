import db from '@database/models';
import md5 from 'md5';

export const createPassword = password =>{
    return md5(password)
}

export const checkPassword = (password, hash) =>{
    return md5(password) === hash;
}

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
  await db.users.create({
    firstName,
    lastName,
    email,
    password:encryptedPassword
  });
};
