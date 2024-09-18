const mongoose = require('mongoose');
const { model, Schema } = mongoose;

let categorySchema = Schema({
	name: {
		type: String,
		minlenght: [3, 'Field category minimal 3 karakter'],
		maxlenght: [20, 'Field category maksimal 20 karakter'],
		required: [true, 'Field category harus diisi'],
	},
	image_url: {
		type: String,
	},
});

module.exports = model('Category', categorySchema);
