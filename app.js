var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var ejs = require('ejs'); 
var logger = require('morgan');
var bodyParser = require('body-parser');
var indexRouter = require('./routes/index');
var api = require('./routes/api');
var sql = require('./routes/pgroute');
var app = express();

app.set("view options", {layout: true}); 
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'false'}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));
app.use('/', indexRouter);
app.use('/api', api);
app.use('/sql', sql);
//app.use(sessionChecker);
app.use(function(req, res, next){
	var err = new Error('Not Found');
	err.status = 404;
	next();
});



module.exports = app;