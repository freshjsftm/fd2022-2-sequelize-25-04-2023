const { Op } = require('sequelize');
const { User } = require('../models');

module.exports.createUser = async (req, res, next) => {
  try {
    const { body } = req;
    const newUser = await User.create(body);
    newUser.password = undefined;
    res.status(201).send({ data: newUser });
  } catch (error) {
    next(error);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
      // order: [['email', 'DESC']],
      // limit: 2,
      // offset: 4,
      //attributes: ['id', 'email', ['is_male', 'newIsMale']]
      // where: {
      //   [Op.and]: [
      //     {
      //       id: {
      //         [Op.gt]: 7,
      //       },
      //     },
      //     { isMale: false },
      //   ],
      // },
    });
    res.status(200).send({ data: users });
  } catch (error) {
    next(error);
  }
};

module.exports.getUserByPk = async (req, res, next) => {
  try {
    const {
      params: { idUser },
    } = req;
    const user = await User.findByPk(idUser, {
      attributes: { exclude: ['password'] },
    });
    res.status(200).send({ data: user });
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
      params: { idUser },
    } = req;
    const userInstance = await User.findByPk(idUser);
    const updatedUser = await userInstance.update(body, {
      returning: true,
    });
    updatedUser.password = undefined;
    res.status(200).send({ data: updatedUser });
  } catch (error) {
    next(error);
  }
};

module.exports.deleteUserInstance = async (req, res, next) => {
  try {
    const {
      params: { idUser },
    } = req;
    const user = await User.findByPk(idUser, {
      attributes: { exclude: ['password'] },
    });
    await user.destroy();
    res.status(200).send({ data: user });
  } catch (error) {
    next(error);
  }
};
