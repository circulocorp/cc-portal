var express = require('express');
var router = express.Router();
const request = require('request')

router.get('/', function(req,res){
	  res.render('index');
});

router.get('/vehicles', function(req,res){
	  res.render('vehicles');
});

router.get('/monitoring', function(req,res){
	  res.render('monitoring');
});

router.get('/serviceaccounts', function(req,res){
	  res.render('accounts');
});

router.get('/notifications', function(req, res){
	res.render('notifications');
});

router.get('/historico', function(req, res){
	res.render('visorsql');
});

module.exports = router;