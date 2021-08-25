const { ERROR_CODE_401 } = require('../utils/constants');

class Auth extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CODE_401;
  }
}

module.exports = Auth;
