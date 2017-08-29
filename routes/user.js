module.exports = function (conn) {
	var express = require('express');
	var app = express();
	var bodyParser = require('body-parser');
	var hat = require('hat');
	var bcrypt = require('bcryptjs');


	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
		extended: true
	}));


	conn.query('USE tourism',
		function (err) {
			if (err) throw err;
			var table = 'CREATE TABLE IF NOT EXISTS admin (id INT NOT NULL AUTO_INCREMENT, PRIMARY KEY(id), email VARCHAR(30) UNIQUE, password VARCHAR(100), authkey VARCHAR(100))';
			conn.query(table, function (err) {
				if (err) throw err;
			});
			table = 'CREATE TABLE IF NOT EXISTS sd (id INT NOT NULL AUTO_INCREMENT, PRIMARY KEY(id), source VARCHAR(30), destination VARCHAR(30), distance INT)';
			conn.query(table, function (err) {
				if (err) throw err;
			});
			table = 'CREATE TABLE IF NOT EXISTS transport (id INT NOT NULL AUTO_INCREMENT, PRIMARY KEY(id), name VARCHAR(30), rate INT)';
			conn.query(table, function (err) {
				if (err) throw err;
			});
			table = 'CREATE TABLE IF NOT EXISTS booking (id INT NOT NULL AUTO_INCREMENT, PRIMARY KEY(id), sdid INT NOT NULL, FOREIGN KEY(sdid) REFERENCES sd(id), tid INT NOT NULL, FOREIGN KEY(tid) REFERENCES transport(id), date VARCHAR(30), name VARCHAR(30), phone VARCHAR(30), r INT)';
			conn.query(table, function (err) {
				if (err) throw err;
			});
			table = 'CREATE TABLE IF NOT EXISTS payment (id INT NOT NULL AUTO_INCREMENT, PRIMARY KEY(id), amount INT, FOREIGN KEY(id) REFERENCES booking(id))';
			conn.query(table, function (err) {
				if (err) throw err;
			});
			bcrypt.hash('password', 10, function (err, hash) {
				table = 'INSERT INTO admin(email, password) VALUES ("smgdark@gmail.com","' + hash + '")';
				conn.query(table, function (err) {
					if (err) console.log('Admin already exists')
				});
			});
		});


	function uniQ(sql, cb) {
		conn.query(sql, function (err, results) {
			cb(err, results)
		});
	}

	function uniR(res, status, msg) {
		res.json({
			status: status,
			msg: msg
		});
	}

	app.get('/', function (req, res) {
		if (req.query.authkey) {
			var sql = 'SELECT id,email FROM admin WHERE authkey = "' + req.query.authkey + '"';
			uniQ(sql, function (err, result) {
				if (err || !result[0]) {
					console.log(err);
					uniR(res, false, 'User not found');
				} else if (result[0]) {
					sql = 'SELECT * FROM sd';
					var data = {};
					uniQ(sql, function (err, result) {
						if (err) {
							uniR(res, false, 'Some error occurred !!');
						} else {
							data.sd = result
							sql = 'SELECT * FROM transport';
							uniQ(sql, function (err, result) {
								if (err) {
									uniR(res, false, 'Some error occurred !!');
								} else {
									data.transport = result;
									sql = 'SELECT sd.source, sd.destination, sd.distance, booking.id, booking.name, booking.phone, booking.r from booking INNER JOIN sd WHERE booking.sdid = sd.id';
									uniQ(sql, function (err, result) {
										if (err) {
											uniR(res, false, 'Some error occurred !!');
										} else {
											data.booking = result;
											sql = 'SELECT id,amount from payment';
											uniQ(sql, function (err, result) {
												if (err) {
													uniR(res, false, 'Some error occurred !!');
												} else {
													data.payment = result;
													res.json({
														status: true,
														data: data
													});
												}
											})
										}
									});
								}
							})
						}
					});
				}
			});
		} else {
			uniR(res, false, 'Invalid entry')
		}
	});

	app.post('/login', function (req, res) {
		if (req.body.email && req.body.password) {
			var sql = 'SELECT password FROM admin WHERE email = "' + req.body.email + '"';
			uniQ(sql, function (err, result) {
				if (err || !result[0]) {
					console.log(err)
					uniR(res, false, 'User not found')
				} else if (result[0]) {
					bcrypt.compare(req.body.password, result[0].password, function (err, resp) {
						if (resp == true) {
							var key = hat();
							var sql = 'UPDATE admin SET authkey = "' + key + '" WHERE email = "' + req.body.email + '"';
							uniQ(sql, function (err, result) {
								if (err) {
									console.log(err)
									uniR(res, false, 'Query err')
								} else {
									res.json({
										status: true,
										msg: 'Logged in successfully !!',
										authkey: key
									});
								}
							});
						} else {
							uniR(res, false, 'Entered password is wrong !!');
						}
					});
				}
			});
		} else {
			uniR(res, false, 'Invalid entry')
		}
	});

	app.post('/addSD', function (req, res) {
		if (req.body.authkey && req.body.source && req.body.destination && req.body.distance) {
			var sql = 'SELECT id FROM admin WHERE authkey = "' + req.body.authkey + '"';
			uniQ(sql, function (err, result) {
				if (err || !result[0]) {
					console.log(err)
					uniR(res, false, 'User not found')
				} else if (result[0]) {
					sql = 'INSERT INTO sd(source, destination, distance) VALUES("' + req.body.source + '","' + req.body.destination + '","' + req.body.distance + '")';
					uniQ(sql, function (err, result) {
						if (err) {
							uniR(res, false, 'Some error occurred !!');
						} else
							uniR(res, true, 'Added Source & Destination !!')
					});
				}
			});
		} else {
			uniR(res, false, 'Invalid entry')
		}
	});

	app.post('/addT', function (req, res) {
		if (req.body.authkey && req.body.name && req.body.rate) {
			var sql = 'SELECT id FROM admin WHERE authkey = "' + req.body.authkey + '"';
			uniQ(sql, function (err, result) {
				if (err || !result[0]) {
					console.log(err)
					uniR(res, false, 'User not found')
				} else if (result[0]) {
					sql = 'INSERT INTO transport(name, rate) VALUES("' + req.body.name + '",' + req.body.rate + ')';
					uniQ(sql, function (err, result) {
						if (err) {
							uniR(res, false, 'Some error occurred !!');
						} else
							uniR(res, true, 'Added Transport !!')
					});
				}
			});
		} else {
			uniR(res, false, 'Invalid entry')
		}
	});

	app.post('/addB', function (req, res) {
		if (req.body.authkey) {
			var sql = 'SELECT id FROM admin WHERE authkey = "' + req.body.authkey + '"';
			uniQ(sql, function (err, result) {
				if (err || !result[0]) {
					console.log(err)
					uniR(res, false, 'User not found')
				} else if (result[0]) {
					sql = 'INSERT INTO booking(sdid, tid, date, name, phone, r) VALUES(' + req.body.sdid + ',' + req.body.tid + ',"' + req.body.date + '","' + req.body.name + '",' + req.body.phone + ',' + req.body.t + ')';
					uniQ(sql, function (err, result) {
						if (err) {
							uniR(res, false, 'Some error occurred !!');
						} else {
							sql = 'INSERT INTO payment(amount) VALUES (' + req.body.amount + ')';
							uniQ(sql, function (err, result) {
								if (err) {
									uniR(res, false, 'Failed !!')
								} else {
									uniR(res, true, 'Added Booking !!')
								}
							})
						}
					});
				}
			});
		} else {
			uniR(res, false, 'Invalid entry')
		}
	});

	app.post('/cancelB', function (req, res) {
		if (req.body.authkey && req.body.id) {
			var sql = 'SELECT id FROM admin WHERE authkey = "' + req.body.authkey + '"';
			uniQ(sql, function (err, result) {
				if (err || !result[0]) {
					uniR(res, false, 'User not found')
				} else if (result[0]) {
					sql = 'DELETE FROM payment where id=' + req.body.id;
					uniQ(sql, function (err, result) {
						if (err) {
							uniR(res, false, 'Some error occurred !!');
						} else {
							sql = 'DELETE FROM booking where id=' + req.body.id;
							uniQ(sql, function (err, result) {
								if (err) {
									uniR(res, false, 'Failed !!')
								} else {
									uniR(res, true, 'Deleted Booking !!')
								}
							})
						}
					});
				}
			});
		} else {
			uniR(res, false, 'Invalid entry')
		}
	});


	return app;
};
