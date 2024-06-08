const router = require('express').Router();
const cartController = require('./controller');
const { checkAuthorization } = require('../../middlewares/authorization');

router.get('/carts', checkAuthorization('read', 'Cart'), cartController.getCart);

router.put(
	'/carts',
	checkAuthorization('update', 'Cart'),
	cartController.updateCart,
);

module.exports = router;
