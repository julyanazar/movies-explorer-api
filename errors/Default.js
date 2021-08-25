const { ERROR_CODE_500 } = require('../utils/constants');

class Default extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CODE_500;
  }
}

module.exports = Default;
