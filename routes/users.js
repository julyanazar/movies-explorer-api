const router = require('express').Router();
const {
  validationUpdateUser,
} = require('../middlewares/validate');
const {
  getCurrentUser,
  updateUser,
} = require('../controllers/users');

router.get('/me', getCurrentUser);
router.patch('/me', validationUpdateUser, updateUser);

module.exports = router;
