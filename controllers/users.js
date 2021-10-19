const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET = 'qwerty' } = process.env;

function sendResponse(res, user) {
  if (user) {
    res.send({ data: user });
  } else {
    throw new Error('пользователь не найден');
  }
}

function findUserByIdInDb(userId, res, next) {
  User.findById(userId)
    .then((user) => sendResponse(res, user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new Error('передан некорректный id'));
      }
      next(err);
    });
}

module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => {
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;
      res.send({ data: userWithoutPassword });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new Error('Переданы некорректные данные при создании пользователя'));
      }
      if (err.name === 'MongoServerError' && err.code === 11000) {
        next(new Error('пользователь с таким email уже существует'));
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'qwerty',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(() => {
      next(new Error('передан неверный логин или пароль'));
    });
};

module.exports.getMyInfo = (req, res, next) => {
  const userId = req.user._id;
  findUserByIdInDb(userId, res, next);
};

module.exports.updateMyProfile = (req, res, next) => {
  const userId = req.user._id;
  const { name, email } = req.body;

  User.findByIdAndUpdate(
    userId,
    { name, email },
    { runValidators: true, new: true },
  )
    .then((user) => sendResponse(res, user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new Error('Переданы некорректные данные при обновлении профиля'));
      }
      next(err);
    });
};
