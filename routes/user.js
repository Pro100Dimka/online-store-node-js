const Router = require('express');
const userController = require('../controllers/user');
const router = new Router();
const authMiddleware = require('../middleware/auth');

// запросы на регистрацию, вход, и проверку авторизирован ли пользователь
router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.get('/auth', authMiddleware, userController.checkLogin);

module.exports = router;
