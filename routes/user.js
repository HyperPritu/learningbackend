const express = require('express');
const router = express.Router(); // For accessing routes using routes folder
const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const user_jwt = require('../middleware/user_jwt');

router.get('/', user_jwt, async (req, res, next) => {
	// user_jwt is called here
	try {
		const user = await User.findById(req.user.id).select('-password'); // Password will not be returned
		res.status(200).json({
			success: true,
			user: user,
		});
		res.end('Hello');
	} catch (err) {
		console.log(err.message);
		res.status(500).json({
			success: false,
			msg: 'Server Error',
		});
		next();
	}
});

router.post('/register', async (req, res, next) => {
	const { username, email, password } = req.body; // Array destructuring to access body values

	try {
		let user_exist = await User.findOne({ email: email }); // Check Existing Email
		if (user_exist) {
			return res.status(400).json({
				success: false,
				msg: 'User already exists',
			});
		}

		let user = new User(); // Creating new User

		user.username = username;
		user.email = email;

		const salt = await bcryptjs.genSalt(10); // Modify 10 times
		user.password = await bcryptjs.hash(password, salt);

		let size = 200;
		user.avatar = 'https://gravatar.com/avatar/?s=' + size + '&d=retro'; // Fetch an avatar

		await user.save(); // Save data of new User

		const payload = {
			user: {
				id: user.id,
			},
		};

		// Signing in with token
		jwt.sign(
			payload,
			process.env.jwtUserSecret,
			{
				expiresIn: 360000,
			},
			(err, token) => {
				if (err) throw err;
				res.status(200).json({
					success: true,
					token: token,
				});
			}
		);
	} catch (error) {
		console.log(error);
	}
});

router.post('/login', async (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;

	try {
		let user = await User.findOne({ email: email });

		// Check if user registered or not
		if (!user) {
			res.status(400).json({
				success: false,
				msg: 'User not registered, Please register to continue!',
			});
		}

		const isMatch = await bcryptjs.compare(password, user.password);

		// Check if password mathces or not
		if (!isMatch) {
			return res.status(400).json({
				success: false,
				msg: 'Invalid Password',
			});
		}

		const payload = {
			user: {
				id: user.id,
			},
		};

		jwt.sign(
			payload,
			process.env.jwtUserSecret,
			{
				expiresIn: 360000,
			},
			(err, token) => {
				if (err) throw err;
				res.status(200).json({
					success: true,
					msg: 'User Logged In',
					token: token,
					user: user,
				});
			}
		);
	} catch (err) {
		console.log(err.message);
		res.status(500).json({
			success: false,
			msg: 'Server Error',
		});
	}
});

module.exports = router;
