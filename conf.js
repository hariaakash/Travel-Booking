module.exports = {
	IP: process.env.IP || '127.0.0.1',
	PORT: process.env.PORT || 3000,
	MYSQL: function (mysql, cb) {
		var connection = mysql.createConnection({
			host: 'localhost',
			user: 'root',
			password: ''
		});
		connection.connect();
		connection.query('CREATE DATABASE IF NOT EXISTS tourism', function (err) {
			if (err) throw err;
			connection.query('USE tourism', function (err) {
				if (err) throw err;
			});
		});
		cb(connection);
	},
	MW: function (app, morgan, cors) {
		app.use(morgan('dev'));
		app.use(cors());
	},
	ROUTES: function (app, conn) {
		var routes = require('./routes');
		routes(app, conn);
		app.get('/*', function (req, res) {
			res.json('hello');
		});
	}
};
