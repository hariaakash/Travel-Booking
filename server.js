var express = require('express');
var app = express();
var morgan = require('morgan');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var cors = require('cors');
var conf = require('./conf');

app.use(express.static('public'))
conf.MYSQL(mysql, function (conn) {
	conf.MW(app, morgan, cors);
	conf.ROUTES(app, conn);
});


app.listen(conf.PORT, conf.IP);
console.log('Server running on ' + conf.IP + ':' + conf.PORT);
