const createError = require('http-errors');
const { Op } = require('sequelize');
const { User } = require('../models');

module.exports.createUser = async (req, res, next) => {
  try {
    const { body } = req;
    const newUser = await User.create(body);
    if (!newUser) {
      return next(createError(400, 'Bad request'));
    }
    // console.log(newUser)
    // newUser.password = undefined;

    const user = newUser.get();
    delete user.password;

    res.status(201).send({ data: user });
  } catch (error) {
    next(error);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
    });
    if (users.length === 0) {
      return next(createError(404, 'Users not found'));
    }
    res.status(200).send({ data: users });
  } catch (error) {
    next(error);
  }
};

module.exports.getUserByPk = async (req, res, next) => {
  try {
    const {
      //params: { idUser },
      userInstance
    } = req;
    // const user = await User.findByPk(idUser, {
    //   attributes: { exclude: ['password'] },
    // });
    res.status(200).send({ data: userInstance });
  } catch (error) {
    next(error);
  }
};

module.exports.updateUserStatic = async (req, res, next) => {
  try {
    const {
      body,
      params: { idUser },
    } = req;
    const [, [updatedUser]] = await User.update(body, {
      where: { id: idUser },
      //returning: ['id', 'email']
      returning: true,
    });
    updatedUser.password = undefined;

    // const user = updatedUser.get();
    // delete user.password;

    res.status(200).send({ data: updatedUser });
  } catch (error) {
    next(error);
  }
};

module.exports.updateUserInstance = async (req, res, next) => {
  try {
    const {
      body,
      //params: { idUser },
      userInstance,
    } = req;
    //const userInstance = await User.findByPk(idUser);
    const updatedUser = await userInstance.update(body, {
      returning: true,
    });
    const user = updatedUser.get();
    delete user.password;
    res.status(200).send({ data: user });
  } catch (error) {
    next(error);
  }
};

module.exports.deleteUserInstance = async (req, res, next) => {
  try {
    const {
      //params: { idUser },
      userInstance,
    } = req;
    // const user = await User.findByPk(idUser, {
    //   attributes: { exclude: ['password'] },
    // });
    await userInstance.destroy();
    //userInstance.password = undefined;
    res.status(200).send({ data: userInstance });
  } catch (error) {
    next(error);
  }
};
