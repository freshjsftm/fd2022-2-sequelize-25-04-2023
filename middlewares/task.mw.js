const createError = require('http-errors');
const { Task } = require('../models');
module.exports.checkTask = async (req, res, next) => {
  try {
    const {
      params: { idTask },
    } = req;
    const task = await Task.findByPk(idTask);
    if (!task) {
      return next(createError(404, 'Task not found'));
    }
    req.taskInstance = task;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports.checkIsUserTask = async (req, res, next) => {
  try {
    const {
      userInstance,
      taskInstance
    } = req;
    const checkHas = await userInstance.hasTask(taskInstance);
    if (!checkHas) {
      return next(createError(403, 'no action'));
    }
    next();
  } catch (error) {
    next(error);
  }
};
