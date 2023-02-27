/* ========= Server using default http package ========= */
// let http = require('http'); // Prebuilt Package

// http.createServer((req, res) => {
// 	res.writeHead(200, {
// 		// Status Code
// 		'Content-Type': 'text/plain',
// 	});

// 	res.end('Hello Nodemon Edit'); // Printing Msg
// }).listen(3000, console.log('Server is running on port 3000')); // Creating server

/* ========= Server using ExpressJs ========= */
const express = require('express');
const colors = require('colors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // Importing the db

const app = express(); // Using this we will create the server

/* MiddleWare */
// app.use((req, res, next) => {
// 	console.log('middleware ran');
// 	req.surname = 'Dey';

// 	next();
// }); // middleware -> a funtion whch runs on every api request

app.use(morgan('dev'));

// Body Parsing
app.use(express.json({}));
app.use(
	express.json({
		extended: true,
	})
);

dotenv.config({
	path: './config/config.env',
}); // Path to ENV file

connectDB();

/* Routes (Will be accessed from routes folder) */
// app.get('/todo', (req, res) => {
// 	// '/todo' -> path to accessing the get request
// 	res.status(200).json({
// 		name: 'Pritam',
// 	});
// });

app.use('/api/todo/auth', require('./routes/user')); // Can be accessed using http://localhost:3000/api/todo/auth/register

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server running on port ${PORT}`.red.underline.bold)); // .red.underline.bold -> colors package | Server listening on port 3000
