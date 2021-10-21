const router = require('express').Router();
const validator = require('validator');
const { celebrate, Joi } = require('celebrate');

const { getAllSavedMovies, createMovie, deleteMovieById } = require('../controllers/movies');

const BadRequestError = require('../errors/bad-request');

const isLink = (value) => {
  const result = validator.isURL(value);
  if (!result) {
    throw new BadRequestError('Переданные данные некорректны. Введите ссылку.');
  }
  return value;
};

router.get('/movies/', getAllSavedMovies);

router.post('/movies/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(isLink),
    trailer: Joi.string().required().custom(isLink),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required().custom(isLink),
    movieId: Joi.number().required(),
  }),
}), createMovie);

router.delete('/movies/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex(),
  }),
}), deleteMovieById);

module.exports = router;
