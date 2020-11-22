var express = require('express');
//var passport = require("passport");
var router = express.Router();
const request = require('request');
var secrets = require('docker-secrets-nodejs');


var pg_host = process.env.PG_HOST || "192.168.1.71";
var pg_user = process.env.PG_USER || "circulocorp";
var pg_pass = secrets.get("pg_pass");

const Pool = require('pg').Pool;
const pool = new Pool({
    user: pg_user,
    host: pg_host,
    database: 'sos',
    password: pg_pass,
    port: 5432,
});

router.get('/', function (req, res) {
    res.render('login');
});

router.get('/index', function (req, res) {
    res.render('index');
});

router.get('/vehicles', function (req, res) {
    res.render('vehicles');
});

router.get('/monitoring', function (req, res) {
    res.render('monitoring');
});

router.get('/serviceaccounts', function (req, res) {
    res.render('accounts');
});

router.get('/notifications', function (req, res) {
    res.render('notifications');
});

router.get('/emergencia', function (req, res) {
    res.render('emergencia');
});

router.get('/newemergency', function (req, res) {
    res.render('new_emergency');
});

router.get('/checkemergency/', function (req, res) {
    res.render('checkemergency', {emergencia: req.query.id});
})

router.get('/editemergency/', function (req, res) {
    var sql = "SELECT reportes.status from centinela.reportes as reportes where id=$1";
    pool.query(sql, [req.query.id], (error, results) => {
        if (error) {
            res.render('emergencia');
        }
        if (results.rowCount > 0 && results.rows[0]["status"] == 1) {
            res.render('edit_emergency', {emergencia: req.query.id});
        } else {
            res.render('checkemergency', {emergencia: req.query.id});
        }
    });
})

router.get('/historico', function (req, res) {
    res.render('visorsql');
});

router.get('/sirius', function (req, res) {
    res.render('sirius/index');
});

router.get('/shells', function (req, res) {
    res.render('sirius/shells');
});

router.get('/logs', function (req, res) {
    res.render('sirius/logs');
});

router.get("/login", function (req, res) {
    res.render("login");
});
router.get("/notfound", function (req, res) {
    res.render("notfound");
});

module.exports = router;