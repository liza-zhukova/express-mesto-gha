const User = require('../models/user');
const { incorrectDataError, notFoundError, serverError } = require('../utils/errors');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(serverError).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.getUserId = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => { res.status(notFoundError).send({ message: 'По переданному id отсутствуют данные' }); })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(incorrectDataError).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(serverError).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(incorrectDataError).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(serverError).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(incorrectDataError).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(serverError).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(incorrectDataError).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(serverError).send({ message: 'На сервере произошла ошибка' });
      }
    });
};
