var environment = require('../routes/sirius_config.js');
var conf;
environment.environment === "STAGIN" ? conf = require('../routes/sirius_staging.js') : conf = require('../routes/sirius_prod.js');

var express = require('express');
var request = require('request');
var secrets = require('docker-secrets-nodejs');
var router = express.Router();

//Variables para EndPoint: SXM-IDM-Login
var APIM_SERVER_NAME = conf.APIM_SERVER_NAME;//"https://prd.api.telematics.net";
var GRANT_TYPE = conf.GRANT_TYPE;//"client_credentials";
var CLIENT_ID = conf.CLIENT_ID;//"NISSAN_CIRCULO_SVL_MX";
var CLIENT_SECRET = conf.CLIENT_SECRET;//"KkxCQUMzSXZ1azNTbE1FU0wxaVMkbC0rd3JVejMy";

//Variables para EndPoint: SXM-Cloud
var URL_SMX_CLOUD = conf.URL_SMX_CLOUD;//"https://access.cv000-telematics.net/auth/oauth2/realms/root/realms/nissanmx/access_token";
var GRANT_TYPE_SMX_CLOUD = conf.GRANT_TYPE_SMX_CLOUD;//'password';
var CLIENT_ID_SMX_CLOUD = conf.CLIENT_ID_SMX_CLOUD;//'nmx-svl-696f-473d-818a-dc4d909f85475';
var CLIENT_SECRET_SMX_CLOUD = conf.CLIENT_SECRET_SMX_CLOUD;//'P9EAjpyTHvw4vKNJxHymvaQUMqLHWXUB7XrS';
var SCOPE_SMX_CLOUD = conf.SCOPE_SMX_CLOUD;//'rts';
var USERNAME_SMX_CLOUD = conf.USERNAME_SMX_CLOUD;//'sa-circulo-svl-nissanmx';
var PASSWORD_SMX_CLOUD = conf.PASSWORD_SMX_CLOUD;//'h%#thB&8hT9PY9bH$zUvE6vCm%XrVFJRq';
var TENANT_ID_SMX_CLOUD = conf.TENANT_ID_SMX_CLOUD;//'Nissanmx';

//Variables para EndPoint: consultarCliente
var CV_APP_TYPE = conf.CV_APP_TYPE;//"OTHER";
var CV_API_KEY = conf.CV_API_KEY;//"C37712F28F9F418E9580033D4601987E";

//Variables para las acciones sobre el vehiculo
var VIN_EXECUTE_TRACKER = conf.VIN_EXECUTE_TRACKER;//"";
var URL_EXECUTE_TRACKER = conf.URL_EXECUTE_TRACKER;//"https://rts.cv000-telematics.net/telematicsservices/v1/vehicles/";
var X_API_KEY_EXECUTE_TRACKER = conf.X_API_KEY_EXECUTE_TRACKER;//"{{apikey}}";



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
            console.log("RESPUESTA ERROR EN EL ROUTE [SXM-IDM-Login]: " + JSON.stringify(error));
            throw new Error(error);
        } else {
            console.log("RESPUESTA EN EL ROUTE [SXM-IDM-Login]: " + JSON.stringify(response));
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
            console.log("RESPUESTA ERROR EN EL ROUTE [SXM-Cloud]: " + JSON.stringify(error));
            throw new Error(error);
        } else {
            console.log("RESPUESTA EN EL ROUTE [SXM-Cloud]: " + JSON.stringify(response));
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
            console.log("RESPUESTA ERROR EN EL ROUTE [consultarCliente]: " + JSON.stringify(error));
            throw new Error(error);
        } else {
            console.log("RESPUESTA EN EL ROUTE [consultarCliente]: " + JSON.stringify(response));
            res.send(response.body);
        }
    });
});

router.post('/estatusLocalizacion', function (req, res, next) {

    var vinRequest = req.body;

    var token_sxm_idm_login = vinRequest.tokenSXMIDMLogin;
    var token_sxm_cloud = vinRequest.tokenSXMCloud;
    VIN_EXECUTE_TRACKER = vinRequest.vin;

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
            console.log("RESPUESTA ERROR EN EL ROUTE [estatusLocalizacion]: " + JSON.stringify(error));
            throw new Error(error);
        } else {
            console.log("RESPUESTA EN EL ROUTE [estatusLocalizacion]: " + JSON.stringify(response));
            res.send(response.body);
        }
    });
});

router.post('/activarLocalizacion', function (req, res, next) {

    var vinRequest = req.body;

    var token_sxm_idm_login = vinRequest.tokenSXMIDMLogin;
    var token_sxm_cloud = vinRequest.tokenSXMCloud;

    VIN_EXECUTE_TRACKER = vinRequest.vin;
    var session_id = vinRequest.sessionId;

    var options = {
        'method': 'POST',
        'url': URL_EXECUTE_TRACKER + VIN_EXECUTE_TRACKER + "/locations/tracker",
        'headers': {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token_sxm_cloud,
            'AccessToken': token_sxm_idm_login,
            'CV-SessionId': session_id
        },
        body: JSON.stringify({'track': {'type': 'Theft', 'duration': 'PT00H06M', 'state': 'Active'}})

    };
    request(options, function (error, response) {
        if (error) {
            console.log("RESPUESTA ERROR EN EL ROUTE [activarLocalizacion]: " + JSON.stringify(error));
            throw new Error(error);
        } else {
            console.log("RESPUESTA EN EL ROUTE [activarLocalizacion]: " + JSON.stringify(response));
            res.send(response.body);
        }
    });
});

router.post('/cancelarLocalizacion', function (req, res, next) {

    var vinRequest = req.body;

    var token_sxm_idm_login = vinRequest.tokenSXMIDMLogin;
    var token_sxm_cloud = vinRequest.tokenSXMCloud;

    VIN_EXECUTE_TRACKER = vinRequest.vin;

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
            console.log("RESPUESTA ERROR EN EL ROUTE [cancelarLocalizacion]: " + JSON.stringify(error));
            throw new Error(error);
        } else {
            console.log("RESPUESTA EN EL ROUTE [cancelarLocalizacion]: " + JSON.stringify(response));
            res.send(response.body);
        }
    });
});

router.post('/bloquearLocalizacion', function (req, res, next) {

    var vinRequest = req.body;

    var token_sxm_idm_login = vinRequest.tokenSXMIDMLogin;
    var token_sxm_cloud = vinRequest.tokenSXMCloud;

    VIN_EXECUTE_TRACKER = vinRequest.vin;
    var session_id = vinRequest.sessionId;

    var options = {
        'method': 'PUT',
        'url': URL_EXECUTE_TRACKER + VIN_EXECUTE_TRACKER + "/locations/tracker",
        'headers': {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token_sxm_cloud,
            'CV-SessionId': session_id,
            'x-api-key': X_API_KEY_EXECUTE_TRACKER,
            'AccessToken': token_sxm_idm_login
        },
        body: JSON.stringify({"track": {"type": "Theft", "duration": "PT00H06M", "state": "Block"}})

    };
    request(options, function (error, response) {
        if (error) {
            console.log("RESPUESTA ERROR EN EL ROUTE [bloquearLocalizacion]: " + JSON.stringify(error));
            throw new Error(error);
        } else {
            console.log("RESPUESTA EN EL ROUTE [bloquearLocalizacion]: " + JSON.stringify(response));
            res.send(response.body);
        }
    });
});

router.post('/aplazarLocalizacion', function (req, res, next) {

    var vinRequest = req.body;

    var token_sxm_idm_login = vinRequest.tokenSXMIDMLogin;
    var token_sxm_cloud = vinRequest.tokenSXMCloud;
    var svc_req_id = vinRequest.svcReqId;

    VIN_EXECUTE_TRACKER = vinRequest.vin;

    var options = {
        'method': 'PUT',
        'url': URL_EXECUTE_TRACKER + VIN_EXECUTE_TRACKER + "/locations/tracker",
        'headers': {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token_sxm_cloud,
            'x-api-key': '{{apikey}}',
            'AccessToken': token_sxm_idm_login
        },
        body: JSON.stringify({"svcReqId": svc_req_id, "track": {"type": "Theft", "duration": "PT00H06M"}})

    };
    request(options, function (error, response) {
        if (error) {
            console.log("RESPUESTA ERROR EN EL ROUTE [aplazarLocalizacion]: " + JSON.stringify(error));
            throw new Error(error);
        } else {
            console.log("RESPUESTA EN EL ROUTE [aplazarLocalizacion]: " + JSON.stringify(response));
            res.send(response.body);
        }
    });

});

module.exports = router;