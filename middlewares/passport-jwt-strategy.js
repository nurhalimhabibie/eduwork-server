const { getToken } = require('../utils/tokenUtils');
const jwt = require('jsonwebtoken');
const config = require('../app/config');
const User = require('../app/user/model');

function decodeToken() {
	return async function (req, res, next) {
		try {
			let token = getToken(req);
			console.log('Token received:', token); // Log token

			if (!token) {
				return next();
			}

			req.user = jwt.verify(token, config.secretkey);
			console.log('User verified:', req.user); // Log user data

			const decodedToken = jwt.decode(token, { complete: true });
			console.log('Decode Token:', decodedToken);

			let user = await User.findOne({ token: { $in: [token] } });
			if (!user) {
				return res.status(404).json({
					error: 1,
					message: 'User not found or Token Expired',
				});
			}
		} catch (err) {
			console.error('Error in decodeToken:', err.message); // Log error
			if (err && err.name === 'JsonWebTokenError') {
				return res.status(400).json({
					error: 1,
					message: err.message,
				});
			}
		}
		return next();
	};
}

module.exports = {
	decodeToken,
};
