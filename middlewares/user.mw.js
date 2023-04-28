const createError = require('http-errors');
const { User } = require('../models');
module.exports.checkUser = async (req, res, next) => {
  try {
    const {
      params: { idUser },
      idUserForTask
    } = req;
    const id = idUser || idUserForTask;
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
    });
    if (!user) {
      return next(createError(404, 'User not found'));
    }
    req.userInstance = user;
    next();
  } catch (error) {
    next(error);
  }
};
