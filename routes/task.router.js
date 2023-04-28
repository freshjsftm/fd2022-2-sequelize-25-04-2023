const { Router } = require('express');
const TaskController = require('../controllers/task.controller');
const { checkTask , checkIsUserTask } = require('../middlewares/task.mw');
const {paginate} = require('../middlewares/paginate.mw');

const taskRouter = Router();

taskRouter.post('/',  TaskController.createTask);
taskRouter.get('/',  paginate, TaskController.getUserTasks);

taskRouter.patch('/:idTask',  checkTask, checkIsUserTask,  TaskController.updateTask);
taskRouter.delete('/:idTask',  checkTask, checkIsUserTask, TaskController.deleteTask);

module.exports = taskRouter;
