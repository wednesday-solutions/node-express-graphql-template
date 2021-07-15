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
    res.send({ ...dataValues, token: token });
  } catch (err) {
    res.send(err.message);
  }
};

export const handleSignIn = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const user = await getUserBySignIn(email, password);
    if (!user) {
      res.send(401, { error: 'User not found!' });
      return;
    }
    res.send({ token: getSignedToken(user) });
  } catch (err) {
    res.send(err.message);
  }
};

const routes = [
  {
    path: '/sign-up',
    method: 'post',
    handler: handleSignUp
  },
  {
    path: '/sign-in',
    method: 'post',
    handler: handleSignIn
  }
];
export default routes;
