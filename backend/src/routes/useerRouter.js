const userRouter = require('express').Router();

const { register } = require('../controllers/authController');
const { login } = require('../middleware/Auth')
userRouter.post('/register',register);
userRouter.post('/login',login);

module.exports = userRouter;