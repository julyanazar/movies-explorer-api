const router = require('express').Router();
const {
  validationUpdateUser,
} = require('../middlewares/validate');
const {
  getCurrentUser,
  updateUser,
} = require('../controllers/users');

router.get('/users/me', getCurrentUser);
router.patch('/users/me', validationUpdateUser, updateUser);

module.exports = router;
