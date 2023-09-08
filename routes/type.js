const Router = require('express');
const typeController = require('../controllers/type');
const router = new Router();
const checkRole = require('../middleware/checkRole');

// запросы на добавление и получения данных
router.post('/', checkRole('ADMIN'), typeController.create);
router.post('/update/:id', checkRole('ADMIN'), typeController.updateItemById);
router.get('/', typeController.getAllItems);
router.get('/:id', typeController.getItemById);
router.post('/delete/:id', checkRole('ADMIN'), typeController.deleteItemById);

module.exports = router;
