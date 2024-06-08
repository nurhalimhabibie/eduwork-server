const router = require('express').Router();
const categoryController = require('./controller');
const { checkAuthorization } = require('../../middlewares/authorization');

router.get('/categories', categoryController.getCategory);
router.post(
	'/categories',
	checkAuthorization('create', 'Category'),
	categoryController.postCategory,
);
router.put(
	'/categories/:id',
	checkAuthorization('update', 'Category'),
	categoryController.putUpdateCategory,
);
router.delete(
	'/categories/:id',
	checkAuthorization('delete', 'Category'),
	categoryController.deleteCategory,
);

module.exports = router;
