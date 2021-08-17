const jwt = require('jsonwebtoken');
require('dotenv').config();

export default function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
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
