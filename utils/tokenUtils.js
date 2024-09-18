function getToken(req) {
	let token = req.headers.authorization
		? req.headers.authorization.replace('Bearer ', '')
		: null;
		console.log('Token in getToken:', token); // Log token dalam fungsi getToken
	return token && token.length ? token : null;
}

module.exports = {
	getToken,
};
