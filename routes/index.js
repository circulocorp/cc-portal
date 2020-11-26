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
/**
  * FUNCION PARA INTERCEPTAR TODAS LAS URLs DEL SISTEMA,
  * NO APLICARAN PARA /login /notfound Y LAS QUE VAYAMOS DESCARTANDO
**/
router.use(function (req, res, next) {
  console.log('HORA: ', Date.now());
  console.log('Request URL:', req.originalUrl);
  console.log('Request Type:', req.method);
  if (typeof localStorage === "undefined" || localStorage === null) {
     var LocalStorage = require('node-localstorage').LocalStorage;
     localStorage = new LocalStorage('./scratch');
  }
  console.log('interceptando la url para el user: ');
  console.log(localStorage.getItem('usuarioSession'));

/*
  var sql = "SELECT " +
            	"id, " +
            	"user_email, " +
            	"url_permission, " +
            	"status " +
            "FROM request_map " +
            "WHERE user_email = $1";
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
*/

  next();
});

router.get('/', function (req, res) {
    res.render('login');
});


// a middleware sub-stack shows request info for any type of HTTP request to the /user/:id path
/*router.use('/index', function(req, res, next) {
  console.log('Request URL:', req.originalUrl);
  next();
}, function (req, res, next) {
  console.log('Request Type:', req.method);
  next();
});*/


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

router.use('/logs', function (req, res, next) {
  console.log('Request Type:', req.method);
  next();
});

router.post("/passLocalStorage", function (req, res) {
    console.log('llamado del lado del passLocalStorage');
    console.log("USUARIO EN EL INDEX LOCAL STROAGE: "+req.body.user);
    console.log(req.body.user);
    console.log(req.body.reqmap);
    
//    if (typeof localStorage === "undefined" || localStorage === null) {
//       var LocalStorage = require('node-localstorage').LocalStorage;
//       localStorage = new LocalStorage('./scratch');
//    }

  //localStorage.setItem('usuarioSession', req.query.user);
  //console.log(localStorage.getItem('usuarioSession'));
  
  res.status(200).json({"status": true, "message": "Envio de parametros al LOCAL STORAGE de NODE con exito"});
});

router.get("/login", function (req, res) {
    res.render("login");
});
router.get("/notfound", function (req, res) {
    res.render("notfound");
});

module.exports = router;
