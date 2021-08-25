const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');
const Conflict = require('../errors/Conflict');
const Auth = require('../errors/Auth');
const {
  ERROR_MESSAGE_INVALID,
  ERROR_MESSAGE_USERNOTFOUND,
  ERROR_MESSAGE_AUTHORIZATION,
  ERROR_MESSAGE_CREATUSER,
} = require('../utils/constants');
const { JWT } = require('../utils/config');

const { NODE_ENV, JWT_SECRET } = process.env;

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .catch(() => {
      throw new NotFound(ERROR_MESSAGE_USERNOTFOUND);
    })
    .then((currentUser) => res.send({ currentUser }))
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { email, name } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { email, name }, { new: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequest(ERROR_MESSAGE_INVALID);
      }
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then(({ _id }) => res.status(200).send({
      message: 'Пользователь успешно создан',
      user: { _id, email, name },
    }))
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        throw new Conflict(ERROR_MESSAGE_CREATUSER);
      }
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : JWT, { expiresIn: '7d' });

      return res.send({ token });
    })
    .catch(() => {
      throw new Auth(ERROR_MESSAGE_AUTHORIZATION);
    })
    .catch(next);
};

module.exports = {
  getCurrentUser,
  updateUser,
  login,
  createUser,
};
