const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getUserId, createUser, updateUser, updateAvatar, getProfile,
} = require('../controllers/users');
const validate = require('../utils/validate');

router.get('/users', getUsers);
router.get(
  '/users/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().required().length(24).hex(),
    }),
  }),
  getUserId,
);
router.post('/users', createUser);
router.patch(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  updateUser,
);
router.patch(
  '/users/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().custom(validate).required(),
    }),
  }),
  updateAvatar,
);

router.get('/users/me', getProfile);

module.exports = router;
