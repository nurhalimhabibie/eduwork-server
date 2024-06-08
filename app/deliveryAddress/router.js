const router = require('express').Router();
const deliveryAddressController = require('./controller');
const { checkAuthorization } = require('../../middlewares/authorization');

router.get(
	'/delivery-addresses',
	checkAuthorization('view', 'DeliveryAddress'),
	deliveryAddressController.getDeliveryAddress,
);

router.post(
	'/delivery-addresses',
	checkAuthorization('create', 'DeliveryAddress'),
	deliveryAddressController.postDeliveryAddress,
);

router.put(
	'/delivery-addresses/:id',
	checkAuthorization('update', 'DeliveryAddress'),
	deliveryAddressController.putUpdateDeliveryAddress,
);

router.delete(
	'/delivery-addresses/:id',
	checkAuthorization('delete', 'DeliveryAddress'),
	deliveryAddressController.deleteDeliveryAddress,
);

module.exports = router;
