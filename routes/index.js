var express = require('express');
var router = express.Router();
const request = require('request');

/**
 * FUNCION PARA INTERCEPTAR TODAS LAS URLs DEL SISTEMA,
 * NO APLICARAN PARA /login /notfound Y LAS QUE VAYAMOS DESCARTANDO
 **/
router.post("/passLocalStorage", function(req, res, next) {
    console.log('PASS LOCAL STORAGE');
    console.log("USUARIO EN EL LOCAL STORAGE: " + req.body.user);
    console.log("REQUEST MAP EN EL LOCAL STORAGE: " + req.body.reqmap);

    req.session.user = req.body.user;
    req.session.paths = JSON.stringify(req.body.reqmap);

    res.status(200).json({ "status": true, "message": "Envio de parametros al LOCAL STORAGE de NODE con exito", "user": req.body.user });
});

router.use(function(req, res, next) {
    console.log('HORA: ', Date.now());
    console.log('Request URL:', req.originalUrl);
    console.log('Request Type:', req.method);

    if (req.session.user) {
        console.log('USER:', req.session.user);
    }

    if (req.originalUrl === "/cerrarSession") {
        req.session.destroy();
    } else {
        if (req.session.paths) {
            console.log('PATHS:', req.session.paths);
            var request_map = JSON.parse(req.session.paths);

            var sinAcceso = false;
            for (var i = 0; i < request_map.length; i++) {
                var path = request_map[i].url_permission;
                console.log("PATH: ", path);

                if (req.originalUrl === path) {
                    sinAcceso = true;
                    break;
                }
            }

            if (sinAcceso) {
                res.render("notaccess");
            }
        }
    }

    next();
});

router.get('/', function(req, res) {
    res.render('login');
});

router.get('/index', function(req, res) {
    res.render('index');
});

router.get("/login", function(req, res) {
    res.render("login");
});
router.get("/notfound", function(req, res) {
    res.render("notfound");
});
router.get("/notaccess", function(req, res) {
    res.render("notaccess");
});

router.get("/cerrarSession", function(req, res) {
    res.render("login");
});

router.get('/sirius', function(req, res) {
    res.render('sirius/index');
});

router.get('/shells', function(req, res) {
    res.render('sirius/shells');
});

router.get('/logs', function(req, res) {
    res.render('sirius/logs');
});

module.exports = router;