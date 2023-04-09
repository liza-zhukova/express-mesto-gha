const Card = require('../models/card');
const NotFoundError = require('../utils/errors/notFoundError');
const ForbiddenError = require('../utils/errors/forbiddenError');
const IncorrectDataError = require('../utils/errors/incorrectDataError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => {
      res.send(cards);
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then((cardItem) => res.send(cardItem))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectDataError('Переданы некорректные данные'));
      }
      return next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .populate(['owner', 'likes'])
    .orFail(new NotFoundError('Такой карточки не сущеcтвует'))
    .then((card) => {
      if (card.owner._id.toString() !== req.user._id) {
        return Promise.reject(new ForbiddenError('Недостаточно прав'));
      } return Card.remove();
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new IncorrectDataError('Переданы некорректные данные'));
      }
      return next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .populate(['owner', 'likes'])
    .then((card) => {
      if (card) {
        res.send(card);
      } else {
        throw new NotFoundError('Такой карточки не существует');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new IncorrectDataError('Переданы некорректные данные'));
      }
      return next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .populate(['owner', 'likes'])
    .then((cardItem) => {
      if (Card) {
        res.send(cardItem);
      } else {
        throw new NotFoundError('Такой карточки не существует');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new IncorrectDataError('Переданы некорректные данные'));
      }
      return next(err);
    });
};
