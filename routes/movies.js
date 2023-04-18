const express = require('express');

const movieRoutes = express.Router();
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');
const { validationCreatMovie, validationMovieById } = require('../middlewares/validation');

movieRoutes.get('/', getMovies);
movieRoutes.post('/', validationCreatMovie, createMovie);
movieRoutes.delete('/:movieId', validationMovieById, deleteMovie);

exports.movieRoutes = movieRoutes;
