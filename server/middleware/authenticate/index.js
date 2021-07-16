const jwt = require('jsonwebtoken');
require('dotenv').config();

export default function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  console.log("auth",authHeader)
  console.log("type",authHeader)
  const token = authHeader && authHeader.split(' ')[1];
  console.log("token",token)
  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}
