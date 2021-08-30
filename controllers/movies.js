const Movie = require('../models/movie');
const NotFound = require('../errors/NotFound');
const BadRequest = require('../errors/BadRequest');
const Forbidden = require('../errors/Forbidden');
const {
  ERROR_MESSAGE_INVALID,
  ERROR_MESSAGE_FILMNOTFOUND,
  ERROR_MESSAGE_403,
} = require('../utils/constants');

const getMovies = (req, res, next) => Movie.find({})
  .then((movies) => res.status(200).send(movies))
  .catch(next);

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  return Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((movie) => {
      if (!movie) {
        throw new NotFound(ERROR_MESSAGE_FILMNOTFOUND);
      } else {
        res.status(200).send(movie);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest(ERROR_MESSAGE_INVALID));
      } else {
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  const userId = req.user._id;

  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFound(ERROR_MESSAGE_FILMNOTFOUND);
      }
      if (userId !== String(movie.owner)) {
        throw new Forbidden(ERROR_MESSAGE_403);
      }
      return Movie.findByIdAndRemove(movieId)
        .orFail(() => {
          throw new NotFound(ERROR_MESSAGE_FILMNOTFOUND);
        })
        .then((movieData) => res.send({ data: movieData }))
        .catch((err) => {
          if (err.name === 'ValidationError' || err.name === 'CastError') {
            next(new BadRequest(ERROR_MESSAGE_INVALID));
          } else {
            next();
          }
        })
        .catch(next);
    })
    .catch(next);
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
