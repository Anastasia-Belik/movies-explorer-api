const Movie = require('../models/movies');

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
        next(new Error('Переданы некорректные данные при создании карточки'));
      }
      next(err);
    });
};

module.exports.deleteMovieById = (req, res, next) => {
  const movieId = req.params.id;
  const userId = req.user._id;

  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        throw new Error('Карточка с указанным id не найдена');
      }
      if (userId !== movie.owner.toString()) {
        throw new Error('Карточка создана не вами');
      }
      Movie.findByIdAndDelete(movieId)
        .then((deletedMovie) => {
          if (deletedMovie) {
            res.send({ deletedMovie });
          }
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new Error('передан некорректный id'));
      }

      next(err);
    });
};
