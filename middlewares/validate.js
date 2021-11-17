const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const { ERROR_MESSAGE_EMAIL, ERROR_MESSAGE_LINK } = require('../utils/constants');

const validatorEmail = (value) => {
  const isValid = validator.isEmail(value);
  if (isValid) {
    return value;
  }
  throw new Error(ERROR_MESSAGE_EMAIL);
};

const validatorURL = (value) => {
  const isValid = validator.isURL(value);
  if (isValid) {
    return value;
  }
  throw new Error(ERROR_MESSAGE_LINK);
};

const validationSignIn = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom(validatorEmail),
    password: Joi.string().required(),
  }),
});

const validationSignUp = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom(validatorEmail),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
  }),
});

const validationUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().custom(validatorEmail),
  }),
});

const validationMovieID = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().alphanum().hex().length(24),
  }),
});

const validationMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.number().required(),
    description: Joi.string().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    image: Joi.string()
      .required()
      .custom(validatorURL),
    thumbnail: Joi.string()
      .required()
      .custom(validatorURL),
    trailer: Joi.string()
      .required()
      .custom(validatorURL),
    movieId: Joi.number().required(),
  }),
});

module.exports = {
  validationUpdateUser,
  validationSignIn,
  validationSignUp,
  validationMovieID,
  validationMovie,
};
