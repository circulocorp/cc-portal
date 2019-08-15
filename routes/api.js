var express = require('express');
var request = require('request');
var secrets = require('docker-secrets-nodejs');
var router = express.Router();
var amqp = require('amqplib/callback_api');

var API_URL = process.env.API_URL || "http://localhost:8080/api";
var RABBITMQ = secrets.get("rabbitmq_user")+":"+secrets.get("rabbitmq_passw")+"@10.0.4.100:5672"
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
	var placa = req.body;
	amqp.connect('amqp://'+RABBITMQ, function(error0, connection) {
	if (error0) {
	    throw error0;
	}
	 connection.createChannel(function(error1, channel) {
	    if (error1) {
	      throw error1;
	    }
	    var queue = 'mzonehandler';

	    channel.assertQueue(queue, {
	      durable: false
	    });

	    channel.sendToQueue(queue, Buffer.from(place));
	    console.log(" [x] Sent %s", msg);
	  });
	});
});

module.exports = router;