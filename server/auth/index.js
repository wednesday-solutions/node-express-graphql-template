import { Op } from 'sequelize';
import db from '@database/models';
import { Token } from '@utils/constants';

const getSignedToken = user => new Token({ user }).get();

export const getUserBySignIn = async (email, password) => {
  convertDbResponseToRawResponse(
      await db.users.findOne({
        where: {
          [Op.and]: [{ email }, { password }]
        }
      })
  );
};

export const handleSignUp = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body || {};
    const newUser = await db.users.create({
      firstName,
      lastName,
      email,
      password
    });
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
    const user = getUserBySignIn(email,password)
    if (!user) {
      res.sendStatus(401);
      return;
    }
    res.send({ token: getSignedToken(user) });
  } catch (err) {
    res.send(err.message);
  }
};

export default [
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
