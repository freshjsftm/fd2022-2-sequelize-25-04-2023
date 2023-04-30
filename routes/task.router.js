const { Router } = require('express');
const TaskController = require('../controllers/task.controller');
const { checkTask , checkIsUserTask } = require('../middlewares/task.mw');
const {paginate} = require('../middlewares/paginate.mw');

const taskRouter = Router();
// http://localhost:3000/api//users/:idUser/tasks
taskRouter.post('/',  TaskController.createTask);
taskRouter.get('/',  paginate, TaskController.getUserTasks);
// http://localhost:3000/api//users/:idUser/tasks/:idTask
taskRouter.patch('/:idTask',  checkTask, checkIsUserTask,  TaskController.updateTask);
taskRouter.delete('/:idTask',  checkTask, checkIsUserTask, TaskController.deleteTask);

module.exports = taskRouter;
