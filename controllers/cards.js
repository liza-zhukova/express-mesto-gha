const Card = require('../models/card');
const { incorrectDataError, notFoundError, serverError } = require('../utils/errors');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(serverError).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(incorrectDataError).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(serverError).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then((card) => {
      if (!card) {
        res.status(notFoundError).send({ message: 'По переданному id отсутствуют данные' });
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(incorrectDataError).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(serverError).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(() => { res.status(notFoundError).send({ message: 'По переданному id отсутствуют данные' }); })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(incorrectDataError).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(serverError).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(incorrectDataError).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(serverError).send({ message: 'На сервере произошла ошибка' });
      }
    });
};
