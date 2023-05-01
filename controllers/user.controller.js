const createError = require('http-errors');
const _ = require('lodash');
const { Op } = require('sequelize');
const { User } = require('../models');

const pickBody = (body) => _.pick(body, ['firstName', 'lastName', 'email', 'password', 'birthday', 'isMale']);

module.exports.createUser = async (req, res, next) => {
  try {
    const { body } = req;
    const values = pickBody(body);
    const newUser = await User.create(values);
    if (!newUser) {
      return next(createError(400, 'Bad request'));
    }
    const user = newUser.get();
    delete user.password;
    res.status(201).send({ data: user });
  } catch (error) {
    next(error);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const { pagination = {} } = req;
    const users = await User.findAll({
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
      ...pagination,
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
    const { userInstance } = req;
    const countUsersTasks = await userInstance.countTasks();
    userInstance.dataValues.countTasks = countUsersTasks;
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
    const values = pickBody(body);
    const [, [updatedUser]] = await User.update(values, {
      where: { id: idUser },
      //returning: ['id', 'email']
      returning: true,
    });
    updatedUser.password = undefined;
    res.status(200).send({ data: updatedUser });
  } catch (error) {
    next(error);
  }
};

module.exports.updateUserInstance = async (req, res, next) => {
  try {
    const { body, userInstance } = req;
    const values = pickBody(body);
    const updatedUser = await userInstance.update(values, {
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
    const { userInstance } = req;
    await userInstance.destroy();
    res.status(200).send({ data: userInstance });
  } catch (error) {
    next(error);
  }
};
