const mongoose = require('mongoose');

module.exports = mongoose.model('languages', new mongoose.Schema({
	_id: { type: String, required: true },
	language: { type: String, required: true },
}));