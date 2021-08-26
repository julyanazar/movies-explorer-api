const jwt = require('jsonwebtoken');
const Auth = require('../errors/Auth');
const { ERROR_MESSAGE_UNAUTH } = require('../utils/constants');
const { CURRENT_PORT } = require('../utils/config');

const { JWT_SECRET = CURRENT_PORT } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new Auth(ERROR_MESSAGE_UNAUTH);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new Auth(ERROR_MESSAGE_UNAUTH);
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};
