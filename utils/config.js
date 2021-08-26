require('dotenv').config();

const {
  MONGO,
  JWT_SECRET,
  PORT,
  NODE_ENV,
} = process.env;

const CURRENT_JWT_SECRET = NODE_ENV === 'production' && JWT_SECRET ? JWT_SECRET : 'dev-secret';
const CURRENT_PORT = NODE_ENV === 'production' && PORT ? PORT : 3001;
const CURRENT_MONGO = NODE_ENV === 'production' && MONGO ? MONGO : 'mongodb://localhost:27017/bitfilmsdb';

module.exports = {
  CURRENT_JWT_SECRET,
  CURRENT_MONGO,
  CURRENT_PORT,
};
