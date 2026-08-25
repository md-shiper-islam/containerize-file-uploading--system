const jwt = require('jsonwebtoken');
const { JWT_SECRET_Key } = require('../secret');

const protect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET_Key);
      req.userId = decoded.id;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Authorization fail, token is Wrong' });
    }
  } else {
    return res.status(401).json({ message: ' do not Authorization , Please login' });
  }
};

module.exports = protect;