module.exports = function (app, conn) {
	// Require Routes
	var user = require('./routes/user')(conn);

	// Use Routes
	app.use('/user', user);
};
