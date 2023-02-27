const mongoose = require('mongoose');

const connectDB = async () => {
	mongoose.set('strictQuery', true);
	const connection = await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
	console.log(`MongoDB connected: ${connection.connection.host}`.cyan.bold);
};

module.exports = connectDB; // We can use this code from anywhere by importing the exported function
