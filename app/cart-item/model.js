const mongoose = require('mongoose');
const { model, Schema } = mongoose;

const cartItemSchema = Schema({
	name: {
		type: String,
		required: [true, 'Field name tidak boleh kosong'],
		minlength: [5, 'Field name minimal 5 karakter'],
		maxlength: [255, 'Field name maksimal 255 karakter'],
	},
	qty: {
		type: Number,
		required: [true, 'Field qty tidak boleh kosong'],
		min: [1, 'Kuantitas minimal 1'],
	},
	price: {
		type: Number,
		default: 0,
	},
	image_url: {
		type: String,
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: [true, 'Field user tidak boleh kosong'],
	},
	product: {
		type: Schema.Types.ObjectId,
		ref: 'Product',
		required: [true, 'Field product tidak boleh kosong'],
	},
});

module.exports = model('CartItem', cartItemSchema);
