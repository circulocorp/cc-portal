var express = require('express');
var request = require('request');
var secrets = require('docker-secrets-nodejs');
var router = express.Router();
var amqp = require('amqplib/callback_api');

var API_URL = process.env.API_URL || "http://localhost:8080/api";
var RABBITMQ = "amqp://"+secrets.get("rabbitmq_user")+":"+secrets.get("rabbitmq_passw")+"@10.0.4.100:5672"
//var RABBITMQ = "amqp://admin:admin123@192.168.1.70:5672"
var token =  secrets.get("token_key");


/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('API section');
});

router.get('/vehicles', function(req, res, next){
	request.get(API_URL+'/vehicles', {json: true}, (err, re, body) => {
		res.send(body);
	});
});

router.get('/vehicles/registration/:placas', function(req, res, next){
	request.get(API_URL+'/vehicles/registration/'+req.params.placas, {json: true}, (err, re, body) => {
		res.send(body);
	});
});

router.get('/vehicles/unitid/:unitid', function(req, res, next){
	request.get(API_URL+'/vehicles/unitid/'+req.params.unitid, {json: true}, (err, re, body) => {
		res.send(body);
	});
});


router.patch('/vehicles', function(req, res, next){
	var vehicle = req.body;
	var url = API_URL+'/vehicle/'+vehicle["_id"];
	var options = {
   		uri: url,
   		json: true,
   		method: 'PATCH',
   		body: vehicle
	};
	request(options, (err, re, body) => {
		res.send(body);
	});
});



router.get('/serviceaccounts', function(req, res, next){
	var auth = "Basic " + new Buffer("circulocorp:"+token).toString("base64");
	var url = API_URL+'/accounts/' 
	var options = {
   		uri: url,
   		json: true,
   		method: 'GET',
   		headers: {
      		'Authorization': auth
   		}
	};
	request(options, (err, re, body) => {
		res.send(body);
	});
});

router.post('/serviceaccounts', function(req, res, next){
	var auth = "Basic " + new Buffer("circulocorp:"+token).toString("base64");
	var url = API_URL+'/accounts/' 
	var options = {
   		uri: url,
   		json: true,
   		method: 'POST',
   		data: req.data,
   		headers: {
      		'Authorization': auth
   		}
	};
	request(options, (err, re, body) => {
		res.send(body);
	});
});

router.get('/notifications', function(req, res, next){
	var auth = "Basic " + new Buffer("circulocorp:"+token).toString("base64");
	var url = API_URL+'/notificationadmins/' 
	var options = {
   		uri: url,
   		json: true,
   		method: 'GET',
   		headers: {
      		'Authorization': auth
   		}
	};
	request(options, (err, re, body) => {
		console.log(body);
		res.send(body);
	});
});

router.post('/notifications', function(req, res, next){
	var auth = "Basic " + new Buffer("circulocorp:"+token).toString("base64");
	var url = API_URL+'/notificationadmins/' ;
	var options = {
   		uri: url,
   		method: 'POST',
   		form: req.body,
   		json: true,
   		headers: {
      		'Authorization': auth,
      		'Content-type': 'application/json'
   		}
	};
	request(options, (err, re, body) => {
		if(err)
			console.log(err);
		res.send(body);
	});
});

router.patch('/notifications/', function(req, res, next){
	var auth = "Basic " + new Buffer("circulocorp:"+token).toString("base64");
	var notification = req.body;
	var url = API_URL+'/notificationadmins/'+notification["_id"];
	var options = {
   		uri: url,
   		json: true,
   		method: 'PATCH',
   		form: notification,
   		headers: {
      		'Authorization': auth,
      		'Content-type': 'application/json'
   		}
	};
	console.log(options);
	request(options, (err, re, body) => {
		if(err)
			console.log(err);
		console.log(body);
		res.send(body);
	});
});

router.delete('/notifications/:id', function(req, res, next){
	var auth = "Basic " + new Buffer("circulocorp:"+token).toString("base64");
	var notification = req.params.id;
	console.log(notification);
	var url = API_URL+'/notificationadmins/'+notification;
	var options = {
   		uri: url,
   		json: true,
   		method: 'DELETE',
   		headers: {
      		'Authorization': auth
   		}
	};
	request(options, (err, re, body) => {
		console.log(body);
		res.send(body);
	});
});

router.post('/mzonevehicle/', function(req, res, next){
	var placa = {"registration": req.body.placa};
	amqp.connect(RABBITMQ, function(err, conn){
		conn.createChannel(function(err0, ch){
			ch.assertExchange('circulocorp', 'direct', {durable: true});
    		ch.publish('circulocorp', 'mzonehandler', Buffer.from(JSON.stringify(placa)));
    		res.send("OK");
		});
		setTimeout(function() { 
    		conn.close();  
  		}, 500);
	});
});

module.exports = router;