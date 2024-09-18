// const router = require('express').Router();
// const categoryController = require('./controller');
// const { checkAuthorization } = require('../../middlewares/authorization');

// router.get('/categories', categoryController.getCategory);
// router.post(
// 	'/categories',
// 	checkAuthorization('create', 'Category'),
// 	categoryController.postCategory,
// );
// router.put(
// 	'/categories/:id',
// 	checkAuthorization('update', 'Category'),
// 	categoryController.putUpdateCategory,
// );
// router.delete(
// 	'/categories/:id',
// 	checkAuthorization('delete', 'Category'),
// 	categoryController.deleteCategory,
// );

// module.exports = router;

const router = require('express').Router();
const multer = require('multer');
const os = require('os');
const categoryController = require('./controller');
const { checkAuthorization } = require('../../middlewares/authorization');

router.get(
	'/categories',
	checkAuthorization('read', 'Category'),
	categoryController.getCategories,
);

router.post(
	'/categories',
	multer({ dest: os.tmpdir() }).single('image'),
	checkAuthorization('create', 'Category'),
	categoryController.postCategory,
);

router.put(
	'/categories/:id',
	multer({ dest: os.tmpdir() }).single('image'),
	checkAuthorization('update', 'Category'),
	categoryController.putUpdateCategory,
);

router.delete(
	'/categories/:id',
	checkAuthorization('delete', 'Category'),
	categoryController.deleteCategory,
);

module.exports = router;
