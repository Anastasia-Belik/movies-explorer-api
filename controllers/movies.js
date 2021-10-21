const Movie = require('../models/movies');
const BadRequestError = require('../errors/bad-request');
const ForbiddenError = require('../errors/forbidden');
const NotFoundError = require('../errors/not-found');

module.exports.getAllSavedMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send({ movies }))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => res.send({ movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      }
      next(err);
    });
};

module.exports.deleteMovieById = (req, res, next) => {
  const movieId = req.params.id;
  const userId = req.user._id;

  Movie.findById(movieId)
    .orFail(new NotFoundError('Фильм с указанным id не найден'))
    .then((movie) => {
      if (userId === movie.owner.toString()) {
        return movie.remove()
          .then(() => res.status(200).send({ message: 'Фильм удален' }));
      }
      throw new ForbiddenError('Нельзя удалять чужой фильм');
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        next(new BadRequestError('передан некорректный id'));
      }

      next(err);
    });
};
