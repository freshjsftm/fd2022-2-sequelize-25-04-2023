const _ = require('lodash');
const createError = require('http-errors');
const { Group, User } = require('../models');

module.exports.createGroup = async (req, res, next) => {
  try {
    const { body } = req;
    const values = _.pick(body, ['title', 'imagePath', 'description']);
    const newGroup = await Group.create(values);

    //find user
    const user = await User.findByPk(body.userId, {
      attributes: {
        exclude: ['password'],
      },
    });
    if (!user) {
      return next(createError(404, 'User not found'));
    }
    //connect user with group
    //await user.addGroup(newGroup);
    await newGroup.addUser(user);

    res.status(201).send({ data: newGroup });
  } catch (error) {
    next(error);
  }
};

module.exports.getUserGroups = async (req, res, next) => {
  try {
    const {
      params: { idUser },
    } = req;
    const userWithGroups = await User.findByPk(idUser, {
      attributes: {
        exclude: ['password'],
      },
      //include: [Group],
      include: [
        {
          model: Group,
          through: {
            attributes: [],
          },
        },
      ],
    });
    if (!userWithGroups) {
      return next(createError(404, 'User not found'));
    }
    res.status(200).send({ data: userWithGroups });
  } catch (error) {
    next(error);
  }
};

module.exports.addUserAtGroup = async (req, res, next) => {
  try {
    const {
      params: { idGroup },
      body: { userId },
    } = req;
    //find group
    const group = await Group.findByPk(idGroup);
    if (!group) {
      return next(createError(404, 'Group not found'));
    }
    //find user
    const user = await User.findByPk(userId, {
      attributes: {
        exclude: ['password'],
      },
    });
    if (!user) {
      return next(createError(404, 'User not found'));
    }
    //connect user to group
    await user.addGroup(group);
    res.status(200).send({ data: group });
  } catch (error) {
    next(error);
  }
};

module.exports.getUsersInGroup = async (req, res, next) => {
  try {
    const {
      params: { idGroup },
    } = req;
    const groupWithUsers = await Group.findByPk(idGroup, {
      include: [
        {
          model: User,
          //attributes: ['email', 'isMale'],
          attributes: {
            exclude: ['password'],
          },
          through: {
            attributes: [],
          },
        },
      ],
    });
    if (!groupWithUsers) {
      return next(createError(404, 'Group not found'));
    }
    res.status(200).send({ data: groupWithUsers });
  } catch (error) {
    next(error);
  }
};
