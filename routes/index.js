const router = require('express').Router();

const {
  validationSignIn,
  validationSignUp,
} = require('../middlewares/validate');
const {
  login,
  createUser,
} = require('../controllers/users');

const usersRouter = require('./users');
const moviesRouter = require('./movies');
const auth = require('../middlewares/auth');

router.post('/signin', validationSignIn, login);
router.post('/signup', validationSignUp, createUser);

router.use('/users', auth, usersRouter);
router.use('/movies', auth, moviesRouter);

module.exports = router;
