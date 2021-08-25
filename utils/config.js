const JWT = 'dev-secret';
const { MONGO = 'mongodb://localhost:27017/bitfilmsdb' } = process.env;

module.exports = {
  JWT,
  MONGO,
};
