import { Token } from '../utils/token';
import { getUserBySignIn, createUserBySignup } from '../daos/auth';
const getSignedToken = user => new Token({ user }).get();

export const handleSignUp = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body || {};
    const newUser = await createUserBySignup(firstName, lastName, email, password);
    res.data = newUser;
    const token = getSignedToken(newUser);
    const { dataValues } = newUser;
    res.json({ ...dataValues, token: token });
  } catch (err) {
    res.json(err.message);
  }
};

export const handleSignIn = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const user = await getUserBySignIn(email, password);
    if (!user) {
      res.json(401, { errors: ['User not found!'] });
      return;
    }
    res.json({ token: getSignedToken(user) });
  } catch (err) {
    res.json(err.message);
  }
};

export const signUpRoute = {
  path: '/sign-up',
  method: 'post',
  handler: handleSignUp
};

export const signInRoute = {
  path: '/sign-in',
  method: 'post',
  handler: handleSignIn
};
