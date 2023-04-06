const Card = require('../models/card');
const NotFoundError = require('../utils/errors/notFoundError');
const ServerError = require('../utils/errors/serverError');
const ForbiddenError = require('../utils/errors/forbiddenError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => {
      next(new ServerError('На сервере произошла ошибка'));
    });
};

module.exports.createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.id)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('По переданному id отсутствуют данные');
      } else if (req.user._id !== card.owner._id.toString()) {
        next(new ForbiddenError('Недостаточно прав на удаление карточки'));
      } else {
        card.remove()
          .then(() => res.send({ data: card }));
      }
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(() => { throw new NotFoundError('По переданному id отсутствуют данные'); })
    .then((card) => res.send(card))
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(() => { throw new NotFoundError('По переданному id отсутствуют данные'); })
    .then((card) => res.send(card))
    .catch(next);
};
