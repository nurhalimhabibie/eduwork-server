const Categories = require('./model');

const getCategory = async (req, res, next) => {
	try {
		let category = await Categories.find();
		return res.status(200).json(category);
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

const postCategory = async (req, res, next) => {
	try {
		let payload = req.body;
		let category = new Categories(payload);
		await category.save();
		return res.status(201).json(category);
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

const putUpdateCategory = async (req, res, next) => {
	try {
		let payload = req.body;
		let category = await Categories.findByIdAndUpdate(req.params.id, payload, {
			new: true,
			runValidators: true,
		});
		return res.status(200).json(category);
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

const deleteCategory = async (req, res, next) => {
	try {
		let category = await Categories.findByIdAndDelete(req.params.id);
		return res.status(200).json(category);
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

module.exports = {
	getCategory,
	postCategory,
	putUpdateCategory,
	deleteCategory,
};
