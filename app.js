require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { errors } = require('celebrate');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const { notFoundPage } = require('./middlewares/notFoundPage');
const { handleError } = require('./middlewares/handleError');
const { rateLimiter } = require('./utils/rateLimiter');
const { CURRENT_MONGO, CURRENT_PORT } = require('./utils/config');

const mainRouter = require('./routes/index');

const allowedCors = [
  'localhost:3000',
  'http://localhost:3000',
];

const limiter = rateLimit(rateLimiter);
const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const requestHeaders = req.headers['access-control-request-headers'];
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
  }
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);

    return res.status(200).send();
  }

  return next();
});

app.use(helmet());

// Подлключаемся к БД mestodb
mongoose.connect(CURRENT_MONGO, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(express.json());

app.use(requestLogger);
app.use(limiter);

app.use('/', mainRouter);
app.get('*', notFoundPage);
app.use(errorLogger);
app.use(errors());
app.use(handleError);

app.listen(CURRENT_PORT, () => {
  console.log(`App listening on port ${CURRENT_PORT}`);
});
