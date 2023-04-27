const createError = require('http-errors');
const { User } = require('../models');
module.exports.checkUser = async (req, res, next) => {
  try {
    const {
      params: { idUser },
    } = req;
    const user = await User.findByPk(idUser, {
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
