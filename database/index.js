const mongoose = require('mongoose');
const { dbURI } = require('../app/config');

mongoose
	.connect(dbURI)
	.then(() => console.log('Connected to MongoDB Atlas'))
	.catch((err) => console.error('Error connecting to MongoDB Atlas:', err));

const db = mongoose.connection;

module.exports = db;
