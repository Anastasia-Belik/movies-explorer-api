const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
const validator = require('validator');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found');
const BadRequestError = require('./errors/bad-request');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
});

app.use(requestLogger);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const isEmail = (value) => {
  const result = validator.isEmail(value);
  if (!result) {
    throw new BadRequestError('Переданные данные некорректны. Введите email.');
  }
  return value;
};

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom(isEmail),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom(isEmail),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
  }),
}), createUser);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/movies', require('./routes/movies'));

app.use('/', () => {
  throw new NotFoundError('Такой страницы не существует');
});

app.use(errorLogger);

app.use(errors());

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  const customMessage = (statusCode === 500) ? 'Произошла ошибка на сервере' : message;
  res.status(statusCode).send({ message: customMessage });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening ${PORT}`);
});
