const { HTTP_STATUS_OK } = require('http2').constants;
const { userSchema } = require('../models/user');
const BadRequest = require('../errors/BadRequest'); // 400
const NotFound = require('../errors/NotFound'); // 404
const ConflictError = require('../errors/ConflictError'); // 409

// Получить текущего пользователя
exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await userSchema.findById(req.user._id);
    if (user) {
      res.status(HTTP_STATUS_OK).send(user);
    } else {
      next(new NotFound('Нет пользователя'));
    }
  } catch (err) {
    next(err);
  }
};

// Обновление юзера (имя, описание)
exports.updateUser = async (req, res, next) => {
  const { name, email } = req.body;
  try {
    const user = await userSchema.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true, runValidators: true },
    );
    if (!user) {
      next(new NotFound('Пользователь не найден'));
    }
    res.status(HTTP_STATUS_OK).send(user);
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      const { message } = err;
      next(new BadRequest(`Не валидные данные ${message}`));
    } else if (err.code === 11000) {
      next(new ConflictError('Изменить уже существующий email нельзя'));
    } else {
      next(err);
    }
  }
};
