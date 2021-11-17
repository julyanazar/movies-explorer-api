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

router.use(auth);

router.use('/', usersRouter);
router.use('/', moviesRouter);

module.exports = router;
