import { Op } from 'sequelize';
import db from '@database/models';
import { Token } from '@utils/constants';

const getSignedToken = user => new Token({ user }).get();

export const handleSignUp = async (req, res) => {
  const { firstName, lastName, email, password } = req.body || {};
  const newUser = await db.users.create({
    firstName,
    lastName,
    email,
    password
  });
  res.data = newUser;
  const { dataValues } = newUser;
  res.send({ ...dataValues, token: getSignedToken(newUser) });
};

export const handleSignIn = async (req, res) => {
  const { email, password } = req.body || {};
  const user = await db.users.findOne({
    where: {
      [Op.and]: [{ email }, { password }]
    }
  });
  if (!user) {
    res.sendStatus(401);
    return;
  }
  res.send({ token: getSignedToken(user) });
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
