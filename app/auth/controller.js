const User = require('../user/model');
const bcrypt = require('bcrypt');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { getToken } = require('../../utils/tokenUtils');

const register = async (req, res, next) => {
	try {
		const payload = req.body;
		let user = new User(payload);
		await user.save();
		return res.status(201).json(user);
	} catch (err) {
		if (err && err.name === 'ValidationError') {
			return res.status(400).json({
				error: 1,
				message: err.message,
				fields: err.errors,
			});
		}
		next(err);
	}
};

const localStrategy = async (email, password, done) => {
	try {
		let user = await User.findOne({ email }).select(
			'-__v -createdAt -updatedAt -cart_items -token',
		);
		if (!user) return done();
		if (bcrypt.compareSync(password, user.password)) {
			({ password, ...userWithoutPassword } = user.toJSON());
			return done(null, userWithoutPassword);
		}
	} catch (err) {
		done(err, null);
	}
	done();
};

const login = (req, res, next) => {
	passport.authenticate('local', async function (err, user) {
		if (err) return next(err);

		if (!user) {
			return res.status(400).json({
				error: 1,
				message: 'Email or Password incorect',
			});
		}

		try {
			let signed = jwt.sign(user, config.secretkey);

			await User.findByIdAndUpdate(user._id, { $push: { token: signed } });

			res.status(200).json({
				message: 'Login Successfully',
				user,
				token: signed,
			});
		} catch (err) {
			return next(err);
		}
	})(req, res, next);
};

const logout = async (req, res, next) => {
	let token = getToken(req);

	let user = await User.findOneAndUpdate(
		{ token: { $in: [token] } },
		{ $pull: { token: token } },
		{ useFindAndModify: false },
	);

	if (!token || !user) {
		return res.status(400).json({
			error: 1,
			message: 'User Not Found!!!',
		});
	}

	return res.status(200).json({
		error: 0,
		message: 'Logout berhasil',
	});
};

const me = (req, res, next) => {
	// console.log('Request to /me endpoint received'); // Log awal saat fungsi dipanggil

	if (!req.user) {
		// console.log('No user found in request'); // Log jika req.user tidak ada
		return res.status(400).json({
			error: 1,
			message: `You're not login or token expired`,
		});
	}
	// console.log('User found:', req.user); // Log informasi user jika req.user ada
	res.status(200).json(req.user);
};

module.exports = {
	register,
	localStrategy,
	login,
	logout,
	me,
};
