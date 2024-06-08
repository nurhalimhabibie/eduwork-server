const mongoose = require('mongoose');
const { model, Schema } = mongoose;

const productSchema = Schema(
	{
		name: {
			type: String,
			minlenght: [3, 'Field name minimal 3 karakter'],
			required: [true, 'Field name harus diisi'],
		},

		price: {
			type: Number,
			default: 0,
		},

		description: {
			type: String,
			maxlenght: [1000, 'Field deskripsi maksimal 1000 karakter'],
		},

		image_url: {
			type: String,
		},

		category: {
			type: Schema.Types.ObjectId,
			ref: 'Category',
		},

		tags: {
			type: Schema.Types.ObjectId,
			ref: 'Tag',
		},
	},
	{ timestamps: true },
);

module.exports = model('Product', productSchema);
