const mongoose = require('mongoose');

// User Model Data Structure
const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
	},

	avatar: {
		type: String,
	},

	email: {
		type: String,
		required: true,
	},

	password: {
		type: String,
		required: true,
	},
});

module.exports = mongoose.model('User', userSchema); // Exporting the User Model
