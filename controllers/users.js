const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => res.send({ data: users }))
    .catch(() => res.status(404).send({ message: 'Пользователи не найдены' }));
};

module.exports.getUserId = (req, res) => {
  User.findById(req.params.userId)
    .then(user => res.send({ data: user }))
    .catch(() => res.status(404).send({ message: 'Пользователь не найден' }));
};

module.exports.createUser = (req, res) =>{
  const {name, about, avatar} = req.body;
  User.create({ name, about, avatar })
  .then(user => res.send({ data: user }))
  .catch(() => res.status(400).send({ message: 'Переданы некорректные данные в методы создания пользователя' }));
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(400).send({ message: 'Переданы некорректные данные в методы создания пользователя' }));
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch(() => res.status(400).send({ message: 'Переданы некорректные данные в методы создания пользователя' }));
};
