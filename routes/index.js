const { Router } = require('express');
const userRouter = require('./user.router');
const taskRouter = require('./task.router');
const {sendIdUser} = require('../middlewares/sendIdUser.mw');

const router = Router();

router.use('/users', userRouter);

router.use('/users/:idUser/tasks', sendIdUser ,taskRouter);

module.exports = router;