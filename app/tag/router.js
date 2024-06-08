const router = require('express').Router();
const tagController = require('./controller');
const { checkAuthorization } = require('../../middlewares/authorization');

router.get('/tags', tagController.getTag);
router.post('/tags', checkAuthorization('create', 'Tag'), tagController.postTag);
router.put(
	'/tags/:id',
	checkAuthorization('update', 'Tag'),
	tagController.putUpdateTag,
);
router.delete(
	'/tags/:id',
	checkAuthorization('delete', 'Tag'),
	tagController.deleteTag,
);

module.exports = router;
