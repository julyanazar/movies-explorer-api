const Movie = require('../models/movie');
const NotFound = require('../errors/NotFound');
const BadRequest = require('../errors/BadRequest');
const Forbidden = require('../errors/Forbidden');

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
        throw new NotFound('Фильм с таким id не найден');
      } else {
        res.status(200).send(movie);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest(err.message));
      }
      next(err);
    });
};

const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  const userId = req.user._id;

  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFound('Фильм с таким id не найдена');
      }
      if (userId !== String(movie.owner)) {
        throw new Forbidden('Недостаточно прав');
      }
      return Movie.findByIdAndRemove(movieId)
        .orFail(() => {
          throw new NotFound('Фильм с таким id не найдена');
        })
        .then((movieData) => res.send({ data: movieData }))
        .catch((err) => {
          if (err.name === 'ValidationError' || err.name === 'CastError') {
            throw new BadRequest('Переданы некорректные данные');
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
