// const Categories = require('./model');

// const getCategory = async (req, res, next) => {
// 	try {
// 		let category = await Categories.find();
// 		return res.status(200).json(category);
// 	} catch (err) {
// 		if (err && err.name === 'ValidationError') {
// 			return res.status(400).json({
// 				error: 1,
// 				message: err.message,
// 				fields: err.errors,
// 			});
// 		}
// 		next(err);
// 	}
// };

// const postCategory = async (req, res, next) => {
// 	try {
// 		let payload = req.body;

// 		let category = new Categories(payload);
// 		await category.save();
// 		return res.status(201).json(category);
// 	} catch (err) {
// 		if (err && err.name === 'ValidationError') {
// 			return res.status(400).json({
// 				error: 1,
// 				message: err.message,
// 				fields: err.errors,
// 			});
// 		}
// 		next(err);
// 	}
// };

// const putUpdateCategory = async (req, res, next) => {
// 	try {
// 		let payload = req.body;
// 		let category = await Categories.findByIdAndUpdate(req.params.id, payload, {
// 			new: true,
// 			runValidators: true,
// 		});
// 		return res.status(200).json(category);
// 	} catch (err) {
// 		if (err && err.name === 'ValidationError') {
// 			return res.status(400).json({
// 				error: 1,
// 				message: err.message,
// 				fields: err.errors,
// 			});
// 		}
// 		next(err);
// 	}
// };

// const deleteCategory = async (req, res, next) => {
// 	try {
// 		let category = await Categories.findByIdAndDelete(req.params.id);
// 		return res.status(200).json(category);
// 	} catch (err) {
// 		if (err && err.name === 'ValidationError') {
// 			return res.status(400).json({
// 				error: 1,
// 				message: err.message,
// 				fields: err.errors,
// 			});
// 		}
// 		next(err);
// 	}
// };

// module.exports = {
// 	getCategory,
// 	postCategory,
// 	putUpdateCategory,
// 	deleteCategory,
// };

const path = require('path');
const fs = require('fs');
const config = require('../config');
const Categories = require('./model');

const getCategories = async (req, res, next) => {
	try {
		let categories = await Categories.find();
		return res.status(200).json(categories);
	} catch (err) {
		next(err);
	}
};

const postCategory = async (req, res, next) => {
	try {
		let payload = req.body;

		if (req.file) {
			let tmp_path = req.file.path;
			let originalExt = req.file.originalname.split('.').pop();
			let filename = req.file.filename + '.' + originalExt;
			let target_path = path.resolve(
				config.rootpath,
				`public/images/categories/${filename}`,
			);

			const src = fs.createReadStream(tmp_path);
			const dest = fs.createWriteStream(target_path);
			src.pipe(dest);

			src.on('end', async () => {
				try {
					let category = new Categories({ ...payload, image_url: filename });
					await category.save();
					return res.status(201).json(category);
				} catch (err) {
					fs.unlinkSync(target_path);
					if (err && err.name === 'ValidationError') {
						return res.status(400).json({
							error: 1,
							message: err.message,
							fields: err.errors,
						});
					}
					next(err);
				}
			});

			src.on('error', async () => {
				next(err);
			});
		} else {
			let category = new Categories(payload);
			await category.save();
			return res.status(201).json(category);
		}
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
		let { id } = req.params;

		if (req.file) {
			let tmp_path = req.file.path;
			let originalExt = req.file.originalname.split('.').pop();
			let filename = req.file.filename + '.' + originalExt;
			let target_path = path.resolve(
				config.rootpath,
				`public/images/categories/${filename}`,
			);

			let result = await Categories.findById(id);
			let currentImage = `${config.rootpath}/public/images/categories/${result.image_url}`;

			const src = fs.createReadStream(tmp_path);
			const dest = fs.createWriteStream(target_path);
			src.pipe(dest);

			src.on('end', async () => {
				try {
					if (fs.existsSync(currentImage)) {
						fs.unlinkSync(currentImage);
					}

					let category = await Categories.findByIdAndUpdate(id, payload, {
						new: true,
						runValidators: true,
					});
					category.image_url = filename;
					await category.save();
					return res.status(200).json(category);
				} catch (err) {
					fs.unlinkSync(target_path);
					if (err && err.name === 'ValidationError') {
						return res.status(400).json({
							error: 1,
							message: err.message,
							fields: err.errors,
						});
					}
					next(err);
				}
			});

			src.on('error', async () => {
				next(err);
			});
		} else {
			let category = await Categories.findByIdAndUpdate(id, payload, {
				new: true,
				runValidators: true,
			});
			return res.status(200).json(category);
		}
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
		let result = await Categories.findByIdAndDelete(req.params.id);
		let currentImage = `${config.rootpath}/public/images/categories/${result.image_url}`;

		if (fs.existsSync(currentImage)) {
			fs.unlinkSync(currentImage);
		}
		return res.status(200).json(result);
	} catch (err) {
		next(err);
	}
};

module.exports = {
	getCategories,
	postCategory,
	putUpdateCategory,
	deleteCategory,
};
