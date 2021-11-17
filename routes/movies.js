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

router.get('/movies', getMovies);
router.post('/movies', validationMovie, createMovie);
router.delete('/movies/:movieId', validationMovieID, deleteMovie);

module.exports = router;
