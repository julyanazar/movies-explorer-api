const { ERROR_CODE_409 } = require('../utils/constants');

class Conflict extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CODE_409;
  }
}

module.exports = Conflict;
