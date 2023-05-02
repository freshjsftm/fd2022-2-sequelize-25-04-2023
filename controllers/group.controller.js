const _ = require('lodash');
const createError = require('http-errors');
const { Group, User } = require('../models');

const pickBody = (body) =>
  _.pick(body, ['title', 'imagePath', 'description', 'isPrivate']);

module.exports.createGroup = async (req, res, next) => {
  try {
    const { body, file:{filename} } = req;
    const values = pickBody(body);
    const newGroup = await Group.create({...values, imagePath: filename});

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

    res.status(201).send({data: newGroup});
  } catch (error) {
    next(error);
  }
};

module.exports.addImage = async (req, res, next) => {
  try {
    const {file:{filename}, params:{idGroup}} = req;
    const [,[groupUpdated]] = await Group.update({
      imagePath: filename
    },{
      where: { id: idGroup},
      returning: true
    })
    res.status(200).send({data: groupUpdated})
  } catch (error) {
    next(error)
  }
}

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

//update group put
//delete group
//кількість юзерів в групі