const express = require('express');

const routes = express.Router();
const { createUser, login } = require('../controllers/auth');
const { auth } = require('../middlewares/auth');
const { movieRoutes } = require('./movies');
const { userRoutes } = require('./users');
const NotFound = require('../errors/NotFound');
const { validationCreateUser, validationLogin } = require('../middlewares/validation');

routes.post('/signin', validationLogin, login);
routes.post('/signup', validationCreateUser, createUser);

routes.use(auth);
routes.use('/users', userRoutes);
routes.use('/movies', movieRoutes);

// Ошибка на остальные роуты
routes.use((req, res, next) => {
  next(new NotFound('Такой страницы нет.'));
});

exports.routes = routes;
