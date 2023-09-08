const Router = require('express');
const brandController = require('../controllers/brand');
const checkRole = require('../middleware/checkRole');
const router = new Router();

// запросы на добавление и получения данных
router.post('/', checkRole('ADMIN'), brandController.createItem);
router.post('/update/:id', checkRole('ADMIN'), brandController.updateItemById);
router.get('/', brandController.getAllItems);
router.get('/:id', brandController.getItemById);
router.post('/delete/:id', checkRole('ADMIN'), brandController.deleteItemById);

module.exports = router;
