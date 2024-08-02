const { Types } = require('mongoose');
const CartItem = require('../cart-item/model');
// const DeliveryAddress = require('../deliveryAddress/model');
const Order = require('../order/model');
const OrderItem = require('../order-item/model');
const Invoice = require('../invoice/model');

const postOrder = async (req, res, next) => {
	const {
		delivery_fee,
		delivery_address,
		delivery_courier,
		paymentMethod,
		order_items,
	} = req.body;

	try {
		let user = req.user._id;
		let totalQty = 0;
		let subTotal = 0;
		let totalShopping = 0;

		// Hitung subTotal
		for (let item of order_items) {
			subTotal += parseInt(item.price) * parseInt(item.qty);
		}
		// Hitung totalQty
		totalQty = order_items.reduce((total, item) => total + parseInt(item.qty), 0);
		// Hitung totalShopping
		totalShopping += subTotal + parseInt(delivery_fee);

		console.log('total QTY', totalQty);
		console.log('sub total', subTotal);
		console.log('total price', totalShopping);

		// Buat order baru
		let order = new Order({
			user: user,
			_id: new Types.ObjectId(),
			delivery_courier,
			delivery_fee,
			delivery_address: {
				fullName: delivery_address?.fullName,
				phoneNumber: delivery_address?.phoneNumber,
				fullStreet: delivery_address?.fullStreet,
				provinsi: delivery_address?.provinsi,
				kabupaten: delivery_address?.kabupaten,
				kecamatan: delivery_address?.kecamatan,
				kelurahan: delivery_address?.kelurahan,
			},
			totalQty,
			subTotal,
			totalShopping,
			paymentMethod,
			status: 'waiting_payment',
		});

		// Masukkan order items ke dalam OrderItem dan hubungkan dengan order
		let orderItems = await OrderItem.insertMany(
			order_items.map((item) => ({
				order: order._id,
				name: item.name,
				price: parseInt(item.price),
				qty: parseInt(item.qty),
				product: item.product,
			})),
		);

		// Tambahkan orderItems ke dalam order
		orderItems.forEach((item) => order.order_items.push(item));
		await order.save();

		// Buat dan simpan invoice
		const totalPrice = orderItems.reduce(
			(total, item) => total + item.price * item.qty,
			0,
		);

		let invoice = new Invoice({
			user: user,
			order: order._id,
			delivery_courier,
			delivery_fee,
			delivery_address: {
				fullName: delivery_address?.fullName,
				phoneNumber: delivery_address?.phoneNumber,
				fullStreet: delivery_address?.fullStreet,
				provinsi: delivery_address?.provinsi,
				kabupaten: delivery_address?.kabupaten,
				kecamatan: delivery_address?.kecamatan,
				kelurahan: delivery_address?.kelurahan,
			},
			name: orderItems.map((item) => item.name),
			price: orderItems.map((item) => item.price),
			qty: orderItems.map((item) => item.qty),
			total_qty: totalQty,
			totalPrice: totalPrice,
			totalShopping: totalPrice + delivery_fee,
			paymentMethod,
		});
		console.log(invoice, 'invoice');
		await invoice.save();

		// Hapus item di CartItem untuk user ini
		await CartItem.deleteMany({ user: req.user._id });
		return res.status(201).json(order);
	} catch (err) {
		console.log(err);
		if (err.name === 'ValidationError') {
			return res.status(400).json({
				error: 1,
				message: err.message,
				fields: err.errors,
			});
		}
		next(err);
	}
};

const getOrder = async (req, res, next) => {
	try {
		let { skip = 0, limit = 10 } = req.query;
		let user = { user: req.user._id };

		let count = await Order.find(user).countDocuments();

		let orders = await Order.find(user)
			.skip(parseInt(skip))
			.limit(parseInt(limit))
			.populate('order_items')
			.sort('-createdAt');

		return res.status(200).json({
			data: orders.map((order) => order.toJSON({ virtuals: true })),
			count,
		});
	} catch (err) {
		if (err.name === 'ValidationError') {
			return res.status(400).json({
				error: 1,
				message: err.message,
				fields: err.errors,
			});
		}
		next(err);
	}
};

module.exports = {
	postOrder,
	getOrder,
};
