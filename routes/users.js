const express = require('express');

const userRoutes = express.Router();
const {
  getCurrentUser,
  updateUser,
} = require('../controllers/users');
const { validationUpdateUser } = require('../middlewares/validation');

userRoutes.get('/me', getCurrentUser);
userRoutes.patch('/me', validationUpdateUser, updateUser);

exports.userRoutes = userRoutes;
