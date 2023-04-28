const { Router } = require('express');
const TaskController = require('../controllers/task.controller');
const { checkUser } = require('../middlewares/user.mw');
const { checkTask , checkIsUserTask } = require('../middlewares/task.mw');
const {paginate} = require('../middlewares/paginate.mw');

const taskRouter = Router();

taskRouter.post('/', checkUser, TaskController.createTask);
taskRouter.get('/', checkUser, paginate, TaskController.getUserTasks);

taskRouter.patch('/:idTask', checkUser, checkTask, checkIsUserTask,  TaskController.updateTask);
taskRouter.delete('/:idTask', checkUser, checkTask, checkIsUserTask, TaskController.deleteTask);

module.exports = taskRouter;
