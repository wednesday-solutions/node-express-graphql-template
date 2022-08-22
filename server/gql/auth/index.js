import { Token } from '@utils/token';
import { getUserByEmailPassword, createUserBySignup } from '@daos/auth';
import { logger } from '@server/utils';
const getSignedToken = user => new Token({ user }).get();

export const handleSignUp = async (parent, args, context, resolveInfo) => {
  try {
    const { firstName, lastName, email, password } = args;
    const newUser = await createUserBySignup(firstName, lastName, email, password);
    const token = getSignedToken(newUser);
    const { dataValues } = newUser;
    delete dataValues.password;
    return { ...dataValues, token };
  } catch (err) {
    logger().error(err);
    throw err;
  }
};

export const handleSignIn = async (parent, args, context, resolveInfo) => {
  try {
    const { email, password } = args;
    const user = await getUserByEmailPassword(email, password);
    if (!user) {
      throw new Error('User not found!');
    }
    return { token: getSignedToken(user?.dataValues) };
  } catch (err) {
    logger().error(err);
    throw new Error(err.message);
  }
};
