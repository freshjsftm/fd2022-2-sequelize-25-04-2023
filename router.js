const { Router } = require('express');
const UserController = require('./controllers/user.controllers');
const router = Router();

// http://localhost:3000/api/users
router.post('/users', UserController.createUser);
router.get('/users', UserController.getAllUsers);

router.get('/users/:idUser', UserController.getUserByPk)

router.put('/users/:idUser/static', UserController.updateUserStatic);
router.put('/users/:idUser/instance', UserController.updateUserInstance);

router.delete('/users/:idUser/instance', UserController.deleteUserInstance);

module.exports = router;
