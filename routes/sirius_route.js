var express = require('express');
var request = require('request');
var secrets = require('docker-secrets-nodejs');
var router = express.Router();

var APIM_SERVER_NAME = "https://prd.api.telematics.net";
var grant_type = "client_credentials";
var client_id = "NISSAN_CIRCULO_SVL_MX";
var client_secret = "KkxCQUMzSXZ1azNTbE1FU0wxaVMkbC0rd3JVejMy";
var CV_AppType = "OTHER";
var CV_ApiKey = "C37712F28F9F418E9580033D4601987E";




router.get('/obtenberToken', function (req, res, next) {

    var options = {
        'method': 'POST',
        'url': APIM_SERVER_NAME + '/m/idm/oauth2/access_token',
        'headers': {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"grant_type": grant_type, "client_id": client_id, "client_secret": client_secret})

    };
    request(options, function (error, response) {
        if (error) {
            throw new Error(error);
        } else {
            console.log("RESPONSE EN EL ROUTE: " + response.body);
            res.send(response.body);
        }
    });
});

router.post('/consultarCliente', function (req, res, next) {

    console.log(req.body);
    var cliente = req.body;


    var urlSearch = '';

    if (cliente["nombre"] !== null && cliente["nombre"] !== '' && typeof (cliente["nombre"]) !== 'undefined') {
        urlSearch += '+firstName:' + cliente["nombre"];
    }
    if (cliente["apellido"] !== null && cliente["apellido"] !== '' && typeof (cliente["apellido"]) !== 'undefined') {
        urlSearch += '+lastName:' + cliente["apellido"];
    }
    if (cliente["email"] !== null && cliente["email"] !== '' && typeof (cliente["email"]) !== 'undefined') {
        urlSearch += '+email:' + cliente["email"];
    }

    console.log(urlSearch);

    var options = {
        'method': 'GET',
        'url': APIM_SERVER_NAME + '/m/subscription/accounts?q=brand:Nissan' + urlSearch,
        'headers': {
            'Authorization': 'Bearer ' + cliente["token"],
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'CV-AppType': CV_AppType,
            'CV-ApiKey': CV_ApiKey
        }
    };
    request(options, function (error, response) {
        if (error) {
            throw new Error(error);
        } else {
            console.log("RESPONSE EN EL ROUTE: " + response.body);
            res.send(response.body);
        }
    });
});



module.exports = router;