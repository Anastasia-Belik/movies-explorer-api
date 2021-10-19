const jwt = require('jsonwebtoken');
const ForbiddenError = require('../errors/forbidden');

const { JWT_SECRET = 'qwerty' } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new ForbiddenError('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new Error('Необходима авторизация'));
  }

  req.user = payload;

  next();
};
