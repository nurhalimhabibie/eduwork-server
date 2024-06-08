const mongoose = require('mongoose');
const { model, Schema } = mongoose;

let tagSchema = Schema({
	name: {
		type: String,
		required: [true, 'Field tag tidak boleh kosong'],
		minlenght: [3, 'Field tag minimal 3 karakter'],
		maxlenght: [20, 'Field tag maksimal 20 karakter'],
	},
});

module.exports = model('Tag', tagSchema);
