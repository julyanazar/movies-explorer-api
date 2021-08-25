const router = require('express').Router();
const {
  validationMovie,
  validationMovieID,
} = require('../middlewares/validate');
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/', getMovies);
router.post('/', validationMovie, createMovie);
router.delete('/:movieId', validationMovieID, deleteMovie);

module.exports = router;
