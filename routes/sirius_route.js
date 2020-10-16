var express = require('express');
var request = require('request');
var secrets = require('docker-secrets-nodejs');
var router = express.Router();

//Variables para EndPoint: SXM-IDM-Login
var APIM_SERVER_NAME = "https://prd.api.telematics.net";
var GRANT_TYPE = "client_credentials";
var CLIENT_ID = "NISSAN_CIRCULO_SVL_MX";
var CLIENT_SECRET = "KkxCQUMzSXZ1azNTbE1FU0wxaVMkbC0rd3JVejMy";

//Variables para EndPoint: SXM-Cloud
var URL_SMX_CLOUD = "https://access.cv000-telematics.net/auth/oauth2/realms/root/realms/nissanmx/access_token";
var GRANT_TYPE_SMX_CLOUD = 'password';
var CLIENT_ID_SMX_CLOUD = 'nmx-svl-696f-473d-818a-dc4d909f85475';
var CLIENT_SECRET_SMX_CLOUD = 'P9EAjpyTHvw4vKNJxHymvaQUMqLHWXUB7XrS';
var SCOPE_SMX_CLOUD = 'rts';
var USERNAME_SMX_CLOUD = 'sa-circulo-svl-nissanmx';
var PASSWORD_SMX_CLOUD = 'h%#thB&8hT9PY9bH$zUvE6vCm%XrVFJRq';
var TENANT_ID_SMX_CLOUD = 'Nissanmx';

//Variables para EndPoint: consultarCliente
var CV_APP_TYPE = "OTHER";
var CV_API_KEY = "C37712F28F9F418E9580033D4601987E";


//Variables para las acciones sobre el vehiculo
var VIN_EXECUTE_TRACKER = "";
var URL_EXECUTE_TRACKER = "https://rts.cv000-telematics.net/telematicsservices/v1/vehicles/";
var X_API_KEY_EXECUTE_TRACKER = "{{apikey}}";
var CV_SESSIONID_EXECUTE_TRACKER = "3DB1ADA0-E717-11EA-8C04-0A58A9FEAC2A";

router.get('/SXM-IDM-Login', function (req, res, next) {

    var options = {
        'method': 'POST',
        'url': APIM_SERVER_NAME + '/m/idm/oauth2/access_token',
        'headers': {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"grant_type": GRANT_TYPE, "client_id": CLIENT_ID, "client_secret": CLIENT_SECRET})

    };
    request(options, function (error, response) {
        if (error) {
            throw new Error(error);
        } else {
            console.log("RESPONSE EN EL ROUTE [SXM-IDM-Login]: " + response.body);
            res.send(response.body);
        }
    });
});

router.get('/SXM-Cloud', function (req, res, next) {

    var options = {
        'method': 'POST',
        'url': URL_SMX_CLOUD,
        'headers': {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: {
            'grant_type': GRANT_TYPE_SMX_CLOUD,
            'client_id': CLIENT_ID_SMX_CLOUD,
            'client_secret': CLIENT_SECRET_SMX_CLOUD,
            'scope': SCOPE_SMX_CLOUD,
            'username': USERNAME_SMX_CLOUD,
            'password': PASSWORD_SMX_CLOUD,
            'tenantId': TENANT_ID_SMX_CLOUD
        }
    };
    request(options, function (error, response) {
        if (error) {
            throw new Error(error);
        } else {
            console.log("RESPONSE EN EL ROUTE [SXM-Cloud]: " + response.body);
            res.send(response.body);
        }
    });
});

router.post('/consultarCliente', function (req, res, next) {

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

    var options = {
        'method': 'GET',
        'url': APIM_SERVER_NAME + '/m/subscription/accounts?q=brand:Nissan' + urlSearch,
        'headers': {
            'Authorization': 'Bearer ' + cliente["token"],
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'CV-AppType': CV_APP_TYPE,
            'CV-ApiKey': CV_API_KEY
        }
    };
    request(options, function (error, response) {
        if (error) {
            throw new Error(error);
        } else {
            console.log("RESPONSE EN EL ROUTE [consultarCliente]: " + response.body);
            res.send(response.body);
        }
    });
});

router.post('/estatusLocalizacion', function (req, res, next) {

    var vinRequest = req.body;

    var token_sxm_idm_login = vinRequest.tokenSXMIDMLogin;
    var token_sxm_cloud = vinRequest.tokenSXMCloud;
    VIN_EXECUTE_TRACKER = "1N6AA1E50MZ502498"; //vinRequest.vin;

    var options = {
        'method': 'GET',
        'url': URL_EXECUTE_TRACKER + VIN_EXECUTE_TRACKER + "/locations/tracker",
        'headers': {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token_sxm_cloud,
            'x-api-key': X_API_KEY_EXECUTE_TRACKER,
            'AccessToken': token_sxm_idm_login
        }
    };
    request(options, function (error, response) {
        if (error) {
            throw new Error(error);
        } else {
            console.log("RESPONSE EN EL ROUTE [estatusLocalizacion]: " + response.body);
            res.send(response.body);
        }
    });
});

router.post('/activarLocalizacion', function (req, res, next) {

    var vinRequest = req.body;

    var token_sxm_idm_login = vinRequest.tokenSXMIDMLogin;
    var token_sxm_cloud = vinRequest.tokenSXMCloud;
    VIN_EXECUTE_TRACKER = "1N6AA1E50MZ502498"; //vinRequest.vin;

    var options = {
        'method': 'POST',
        'url': URL_EXECUTE_TRACKER + VIN_EXECUTE_TRACKER + "/locations/tracker",
        'headers': {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token_sxm_cloud,
            'AccessToken': token_sxm_idm_login
        },
        body: JSON.stringify({'track': {'type': 'Theft', 'duration': 'PT00H06M', 'state': 'Active'}})

    };
    request(options, function (error, response) {
        if (error) {
            throw new Error(error);
        } else {
            console.log("RESPONSE EN EL ROUTE [activarLocalizacion]: " + response.body);
            res.send(response.body);
        }
    });
});

router.post('/cancelarLocalizacion', function (req, res, next) {

    var vinRequest = req.body;

    var token_sxm_idm_login = vinRequest.tokenSXMIDMLogin;
    var token_sxm_cloud = vinRequest.tokenSXMCloud;
    VIN_EXECUTE_TRACKER = "1N6AA1E50MZ502498"; //vinRequest.vin;

    var options = {
        'method': 'DELETE',
        'url': URL_EXECUTE_TRACKER + VIN_EXECUTE_TRACKER + "/locations/tracker",
        'headers': {
            'Content-Type': 'application/json',
            'AccessToken': token_sxm_idm_login,
            'Authorization': 'Bearer ' + token_sxm_cloud
        }
    };
    request(options, function (error, response) {
        if (error) {
            throw new Error(error);
        } else {
            console.log("RESPONSE EN EL ROUTE [cancelarLocalizacion]: " + response.body);
            res.send(response.body);
        }
    });
});

router.post('/bloquearLocalizacion', function (req, res, next) {

    var token_sxm_idm_login = req.token_sxm_idm_login;
    var token_sxm_cloud = req.token_sxm_cloud;
    VIN_EXECUTE_TRACKER = req.vin;

    var options = {
        'method': 'PUT',
        'url': URL_EXECUTE_TRACKER,
        'headers': {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token_sxm_cloud,
            'CV-SessionId': CV_SESSIONID_EXECUTE_TRACKER,
            'x-api-key': X_API_KEY_EXECUTE_TRACKER,
            'AccessToken': token_sxm_idm_login
        },
        body: JSON.stringify({"track": {"type": "Theft", "duration": "PT00H06M", "state": "Block"}})

    };
    request(options, function (error, response) {
        if (error) {
            throw new Error(error);
        } else {
            console.log("RESPONSE EN EL ROUTE [bloquearLocalizacion]: " + response.body);
            res.send(response.body);
        }
    });
});


module.exports = router;