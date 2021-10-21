const router = require('express').Router();

const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const { createUser, login } = require('../controllers/users');
const BadRequestError = require('../errors/bad-request');

const isEmail = (value) => {
  const result = validator.isEmail(value);
  if (!result) {
    throw new BadRequestError('Переданные данные некорректны. Введите email.');
  }
  return value;
};

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom(isEmail),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
  }),
}), createUser);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom(isEmail),
    password: Joi.string().required(),
  }),
}), login);

module.exports = router;
