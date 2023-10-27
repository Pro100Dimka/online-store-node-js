const Router = require('express');
const deviceController = require('../controllers/device');
const checkRole = require('../middleware/checkRole');
const router = new Router();

// запросы на добавление и получения данных

router.post('/', checkRole('ADMIN'), deviceController.create);
router.post('/update/:id', checkRole('ADMIN'), deviceController.updateItemById);
router.get('/', deviceController.getAllItems);
router.get('/:id', deviceController.getItemById);
router.post('/delete/:id', checkRole('ADMIN'), deviceController.deleteItemById);

module.exports = router;
