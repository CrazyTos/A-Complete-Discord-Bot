const mongoose = require('mongoose');

// Connect to the database
module.exports.connectDB = async function() {
	await mongoose.connect(process.env.MONGO_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	}).catch((err) => {
		console.log('[MongoDB] Unable to connect to MongoDB Database.\nError: ' + err);
	});
	return mongoose;
};
