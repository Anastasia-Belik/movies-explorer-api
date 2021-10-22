const router = require('express').Router();

const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const { getMyInfo, updateMyProfile } = require('../controllers/users');
const BadRequestError = require('../errors/bad-request');

const isEmail = (value) => {
  const result = validator.isEmail(value);
  if (!result) {
    throw new BadRequestError('Переданные данные некорректны. Введите email.');
  }
  return value;
};

router.get('/users/me', getMyInfo);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom(isEmail),
    name: Joi.string().required().min(2).max(30),
  }),
}), updateMyProfile);

module.exports = router;
