const { Router } = require('express');
const UserController = require('./controllers/user.controller');
const TaskController = require('./controllers/task.controller');
const { checkUser } = require('./middlewares/user.mw');
const router = Router();

// http://localhost:3000/api/users
router.post('/users', UserController.createUser);
router.get('/users', UserController.getAllUsers);

router.get('/users/:idUser', checkUser, UserController.getUserByPk)

router.put('/users/:idUser/static', checkUser, UserController.updateUserStatic);
router.put('/users/:idUser/instance', checkUser, UserController.updateUserInstance);

router.delete('/users/:idUser/instance', checkUser, UserController.deleteUserInstance);

router.post('/users/:idUser/tasks', checkUser, TaskController.createTask)
router.get('/users/:idUser/tasks', checkUser, TaskController.getUserTasks);

module.exports = router;
