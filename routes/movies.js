const router = require('express').Router();

const { getAllSavedMovies, createMovie, deleteMovieById } = require('../controllers/movies');

router.get('/', getAllSavedMovies);
router.post('/', createMovie);
router.delete('/:id', deleteMovieById);

module.exports = router;
