const User = require('../models/user');

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

module.exports.getMyInfo = (req, res, next) => {
  const userId = req.user._id;
  findUserByIdInDb(userId, res, next);
};

module.exports.updateMyProfile = (req, res, next) => {
  const userId = req.user._id;
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    userId,
    { name, about },
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
