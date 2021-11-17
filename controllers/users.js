const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const NotFound = require('../errors/NotFound');
const Conflict = require('../errors/Conflict');
const Auth = require('../errors/Auth');
const {
  ERROR_MESSAGE_USERNOTFOUND,
  ERROR_MESSAGE_AUTHORIZATION,
  ERROR_MESSAGE_CREATUSER,
  ERROR_MESSAGE_UPDATEUSER,
  ERROR_MESSAGE_SUCCESSCREATEUSER,
} = require('../utils/constants');
const { CURRENT_JWT_SECRET } = require('../utils/config');

const { NODE_ENV, JWT_SECRET } = process.env;

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFound(ERROR_MESSAGE_USERNOTFOUND);
    })
    .then((currentUser) => res.send(currentUser))
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { email, name } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    { new: true, runValidators: true },
  ).orFail(() => NotFound(ERROR_MESSAGE_USERNOTFOUND))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.code === 11000) {
        next(new Conflict(ERROR_MESSAGE_UPDATEUSER));
      } else {
        next(err);
      }
    });
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
      message: ERROR_MESSAGE_SUCCESSCREATEUSER,
      user: { _id, email, name },
    }))
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        throw new Conflict(ERROR_MESSAGE_CREATUSER);
      }
      throw err;
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : CURRENT_JWT_SECRET, { expiresIn: '7d' });

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
