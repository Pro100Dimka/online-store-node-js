const Router = require('express');
const router = new Router();

const userRouter = require('./user');
const typeRouter = require('./type');
const brandRouter = require('./brand');
const deviceRouter = require('./device');

// подключения всех апи в одном файле
router.use('/user', userRouter);
router.use('/type', typeRouter);
router.use('/brand', brandRouter);
router.use('/device', deviceRouter);

module.exports = router;
