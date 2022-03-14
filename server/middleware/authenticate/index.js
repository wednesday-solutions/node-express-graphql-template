import { isLocalEnv } from '@utils';
import jwt from 'jsonwebtoken';
require('dotenv').config();

export default function authenticateToken(req, res, next) {
  if (isLocalEnv()) {
    next();
    return;
  }
  let authKey;
  Object.keys(req.headers).forEach(header => {
    if (header.toUpperCase() === 'AUTHORIZATION') {
      authKey = header;
    }
  });
  const authHeader = req.headers[authKey];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.json(401, { errors: ['Token not found!'] });
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.json(403, { errors: ['Unauthorized Access!'] });
    }
    req.user = user;
    next();
  });
}
