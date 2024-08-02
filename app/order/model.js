const mongoose = require('mongoose');
const { model, Schema } = mongoose;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const orderSchema = Schema(
	{
		status: {
			type: String,
			enum: ['waiting_payment', 'processing', 'in_delivery', 'delivered'],
			default: 'waiting_payment',
		},

		delivery_courier: {
			type: String,
		},

		delivery_fee: {
			type: Number,
			default: 0,
		},

		delivery_address: {
			fullName: { type: String },
			fullStreet: { type: String },
			provinsi: { type: String },
			kabupaten: { type: String },
			kecamatan: { type: String },
			kelurahan: { type: String },
			phoneNumber: { type: String },
		},

		paymentMethod: {
			type: String,
		},

		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},

		order_items: [
			{
				type: Schema.Types.ObjectId,
				ref: 'OrderItem',
			},
		],

		order_number: {
			type: Number,
		},

		totalQty: {
			type: Number,
		},

		subTotal: {
			type: Number,
		},

		totalShopping: {
			type: Number,
		},
	},
	{ timestamps: true },
);

orderSchema.plugin(AutoIncrement, { inc_field: 'order_number' });

module.exports = model('Order', orderSchema);
