var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const productRoute = require('./app/product/router');
const categoryRoute = require('./app/category/router');
const tagRoute = require('./app/tag/router');
const authRoute = require('./app/auth/router');
const { decodeToken } = require('./middlewares/passport-jwt-strategy');
const deliveryAddressRoute = require('./app/deliveryAddress/router');
const cartRoute = require('./app/cart/router');
const orderRoute = require('./app/order/router');
const invoiceRoute = require('./app/invoice/router');
const port = process.env.PORT || 5000;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Non-authenticated routes
app.use('/auth', authRoute);

// Authentication middleware
app.use(decodeToken());

// Authenticated routes
app.use('/api', productRoute);
app.use('/api', categoryRoute);
app.use('/api', tagRoute);
app.use('/api', deliveryAddressRoute);
app.use('/api', cartRoute);
app.use('/api', orderRoute);
app.use('/api', invoiceRoute);

//home
app.use('/', function (req, res) {
	res.render('index', {
		title: 'Eduwork API Service',
	});
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	if (req.path.startsWith('/api')) {
		// API error response
		res.status(err.status || 500).json({
			message: err.message,
			error: req.app.get('env') === 'development' ? err : {},
		});
	} else {
		// render the error page for non-API routes
		res.status(err.status || 500);
		res.render('error');
	}
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});

module.exports = app;
