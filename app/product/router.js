const router = require('express').Router();
const multer = require('multer');
const os = require('os');
const productController = require('./controller');
const { checkAuthorization } = require('../../middlewares/authorization');

router.get(
	'/products',
	checkAuthorization('read', 'Product'),
	productController.getProducts,
);
router.post(
	'/products',
	multer({ dest: os.tmpdir() }).single('image'),
	checkAuthorization('create', 'Product'),
	productController.postProducts,
);
router.put(
	'/products/:id',
	multer({ dest: os.tmpdir() }).single('image'),
	checkAuthorization('update', 'Product'),
	productController.putUpdateProducts,
);
router.delete(
	'/products/:id',
	checkAuthorization('delete', 'Product'),
	productController.deleteProducts,
);

module.exports = router;
