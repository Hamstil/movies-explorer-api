const { HTTP_STATUS_OK } = require('http2').constants;
const { movieSchema } = require('../models/movie');
const BadRequest = require('../errors/BadRequest'); // 400
const NotFound = require('../errors/NotFound'); // 404
const CurrentError = require('../errors/CurrentError');

// Возвращаем все фильмы добавленные пользователем
exports.getMovies = async (req, res, next) => {
  try {
    const movie = await movieSchema.find({ owner: req.user._id });
    if (movie) {
      res.send(movie);
    }
  } catch (err) {
    next(err);
  }
};

// Создаем каточку фильма
exports.createMovie = async (req, res, next) => {
  try {
    const {
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      movieId,
      nameRU,
      nameEN,
    } = req.body;
    const owner = req.user._id;
    const movie = await (await movieSchema.create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      movieId,
      nameRU,
      nameEN,
      owner,
    }));
    res.status(HTTP_STATUS_OK).send(movie);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const { message } = err;
      next(new BadRequest(`На валидные данные ${message}`));
    } else {
      next(err);
    }
  }
};

// Удалем карточку фильма по id
exports.deleteMovie = async (req, res, next) => {
  try {
    const { movieId } = req.params;
    const movie = await movieSchema.findById(movieId);
    if (!movie) {
      throw new NotFound('Такой катрочки c фильмом нет');
    }
    if (!movie.owner.equals(req.user._id)) {
      throw new CurrentError('Вы не можете удалить чужую карточку');
    }
    await movie.remove();
    res.status(HTTP_STATUS_OK).send({ message: 'Карточка успешно удалена' });
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequest('Переданны некорректные данные'));
    } else {
      next(err);
    }
  }
};
