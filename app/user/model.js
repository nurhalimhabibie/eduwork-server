const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const AutoIncrement = require('mongoose-sequence')(mongoose);
const bcrypt = require('bcrypt');

let userSchema = Schema(
	{
		full_name: {
			type: String,
			required: [true, 'Field name harus diisi'],
			minlength: [3, 'Minimal 3 karakter'],
			maxlength: [255, 'Maksimal fullname 255 karakter'],
		},

		customer_id: {
			type: Number,
		},

		email: {
			type: String,
			required: [true, 'Field email harus diisi'],
			maxlength: [255, 'Maksimal email 255 karakter'],
		},

		password: {
			type: String,
			required: [true, 'Field password harus diisi'],
			maxlength: [255, 'Maksimal password 255 karakter'],
		},

		phoneNumber: {
			type: String,
			required: [true, 'Field nomor handphone harus diisi'],
			minlength: [9, 'Minimal nomor handphone 9 karakter'],
			maxlength: [15, 'Maksimal nomor handphone 15 karakter'],
		},

		role: {
			type: String,
			enum: ['user', 'admin'],
			default: 'user',
		},

		token: [String],
	},
	{ timestamps: true },
);

userSchema.path('email').validate(
	function (value) {
		const EMAIL_RE = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
		return EMAIL_RE.test(value);
	},
	(attr) => `${attr.value} harus merupakan email yang valid!`,
);

userSchema.path('email').validate(
	async function (value) {
		try {
			const count = await this.model('User').countDocuments({ email: value });
			return !count;
		} catch (err) {
			throw err;
		}
	},
	(attr) => `${attr.value} sudah terdaftar`,
);

const HASH_ROUND = 10;
userSchema.pre('save', function (next) {
	this.password = bcrypt.hashSync(this.password, HASH_ROUND);
	next();
});

userSchema.plugin(AutoIncrement, { inc_field: 'customer_id' });

// userSchema.pre('save', async function (next) {
// 	if (!this.customer_id && this.customer_id !== 0) {
// 		const highestCustomerIdUser = await this.constructor.findOne(
// 			{},
// 			{},
// 			{ sort: { customer_id: -1 } },
// 		);
// 		if (highestCustomerIdUser && highestCustomerIdUser.customer_id !== null) {
// 			this.customer_id = highestCustomerIdUser.customer_id + 1;
// 		} else {
// 			this.customer_id = 1; // Nilai default untuk pengguna pertama
// 		}
// 	}
// 	next();
// });

module.exports = model('User', userSchema);
