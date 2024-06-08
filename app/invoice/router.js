const router = require('express').Router();
const invoiceController = require('./controller');

router.get('/invoices/:order_id', invoiceController.getInvoice);

module.exports = router;
