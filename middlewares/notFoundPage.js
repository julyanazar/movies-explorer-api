const NotFound = require('../errors/NotFound');
const { ERROR_MESSAGE_NOTFOUND } = require('../utils/constants');

const notFoundPage = (req, res, next) => {
  next(new NotFound(ERROR_MESSAGE_NOTFOUND));
};

module.exports = { notFoundPage };
