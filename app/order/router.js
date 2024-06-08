const router = require('express').Router();
const orderController = require('./controller');
const { checkAuthorization } = require('../../middlewares/authorization');

router.get('/orders', checkAuthorization('read', 'Order'), orderController.getOrder);

router.post(
	'/orders',
	checkAuthorization('create', 'Order'),
	orderController.postOrder,
);

module.exports = router;
