const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
module.exports = {
	rootpath: path.resolve(__dirname, '..'),
	secretkey: process.env.SECRET_KEY,
	serviceName: process.env.SERVICE_NAME,
	dbURI: process.env.DB_URI,
};
