var environment = require('../routes/sirius_config.js');
var conf;
environment.environment === "STAGIN" ? conf = require('../routes/sirius_staging.js') : environment.environment === "PROD" ? conf = require('../routes/sirius_prod.js') : conf = require('../routes/sirius_dev.js');

var express = require('express');
var request = require('request');
var secrets = require('docker-secrets-nodejs');
var router = express.Router();

//Variables para EndPoint: SXM-Cloud
var URL_SMX_CLOUD = conf.URL_SMX_CLOUD;
var GRANT_TYPE_SMX_CLOUD = conf.GRANT_TYPE_SMX_CLOUD;
var SCOPE_SMX_CLOUD = conf.SCOPE_SMX_CLOUD;

var CLIENT_ID_SMX_CLOUD = conf.CLIENT_ID_SMX_CLOUD;
var CLIENT_SECRET_SMX_CLOUD = conf.CLIENT_SECRET_SMX_CLOUD;
var USERNAME_SMX_CLOUD = conf.USERNAME_SMX_CLOUD;
var PASSWORD_SMX_CLOUD = conf.PASSWORD_SMX_CLOUD;

//Variables para EndPoint: consultarCliente y consultarAuto
var URL_SMX_CLOUD_CLIENTE = conf.URL_SMX_CLOUD_CLIENTE;
var URL_SMX_CLOUD_AUTO = conf.URL_SMX_CLOUD_AUTO;
var URL_SMX_CLOUD_AUTO_DETALLE = conf.URL_SMX_CLOUD_AUTO_DETALLE;
var URL_SMX_CLOUD_TRAKING = conf.URL_SMX_CLOUD_TRAKING;

//Variables para las acciones sobre el vehiculo
var VIN_EXECUTE_TRACKER = conf.VIN_EXECUTE_TRACKER;
var URL_EXECUTE_TRACKER = conf.URL_EXECUTE_TRACKER;
var X_API_KEY_EXECUTE_TRACKER = conf.X_API_KEY_EXECUTE_TRACKER;

var URL_MZONE_TOKEN = conf.URL_MZONE_TOKEN;
var GRANT_TYPE_MZONE = conf.GRANT_TYPE_MZONE;
var CLIENT_ID_MZONE = conf.CLIENT_ID_MZONE;
var CLIENT_SECRET_MZONE = conf.CLIENT_SECRET_MZONE;
var SCOPE_MZONE = conf.SCOPE_MZONE;
var USERNAME_MZONE = conf.USERNAME_MZONE;
var PASSWORD_MZONE = conf.PASSWORD_MZONE;

var USERNAME_MZONE_HIJA = conf.USERNAME_MZONE_HIJA;
var PASSWORD_MZONE_HIJA = conf.PASSWORD_MZONE_HIJA;

router.get('/SXM-IDM-Login', function(req, res, next) {

    var options = {
        'method': 'POST',
        'url': APIM_SERVER_NAME + '/m/idm/oauth2/access_token',
        'headers': {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "grant_type": GRANT_TYPE, "client_id": CLIENT_ID, "client_secret": CLIENT_SECRET })

    };
    request(options, function(error, response) {
        if (error) {
            console.log("RESPUESTA ERROR EN EL ROUTE [SXM-IDM-Login]: " + JSON.stringify(error));
            throw new Error(error);
        } else {
            console.log("RESPUESTA EN EL ROUTE [SXM-IDM-Login]: " + JSON.stringify(response));
            res.send(response.body);
        }
    });

});

router.post('/SXM-Cloud', function(req, res, next) {

    var tenan = req.body;
    console.log("TENAN EN EL REPOSITORY: " + JSON.stringify(tenan));

    CLIENT_ID_SMX_CLOUD = tenan.tenan_id === 'nissanmx' ? conf.CLIENT_ID_SMX_CLOUD : conf.CLIENT_ID_SMX_CLOUD_INFINITI;
    CLIENT_SECRET_SMX_CLOUD = tenan.tenan_id === 'nissanmx' ? conf.CLIENT_SECRET_SMX_CLOUD : conf.CLIENT_SECRET_SMX_CLOUD_INFINITI;
    USERNAME_SMX_CLOUD = tenan.tenan_id === 'nissanmx' ? conf.USERNAME_SMX_CLOUD : conf.USERNAME_SMX_CLOUD_INFINITI;
    PASSWORD_SMX_CLOUD = tenan.tenan_id === 'nissanmx' ? conf.PASSWORD_SMX_CLOUD : conf.PASSWORD_SMX_CLOUD_INFINITI;

    var options = {
        'method': 'POST',
        'url': 'https://' + URL_SMX_CLOUD + '/auth/oauth2/realms/root/realms/' + tenan.tenan_id + '/access_token',
        'headers': {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: {
            'grant_type': GRANT_TYPE_SMX_CLOUD,
            'client_id': CLIENT_ID_SMX_CLOUD,
            'client_secret': CLIENT_SECRET_SMX_CLOUD,
            'scope': SCOPE_SMX_CLOUD,
            'username': USERNAME_SMX_CLOUD,
            'password': PASSWORD_SMX_CLOUD
        }
    };

    request(options, function(error, response) {
        if (error) {
            console.log("RESPUESTA ERROR EN EL ROUTE [SXM-Cloud]: " + JSON.stringify(error));
            throw new Error(error);
        } else {
            console.log("RESPUESTA EN EL ROUTE [SXM-Cloud]: " + JSON.stringify(response));
            res.send(response.body);
        }
    });
});

router.post('/consultarCliente', function(req, res, next) {

    var cliente = req.body;
    var urlSearch = '';
    var urlSearchNombre = '';
    var urlSearchApellido = '';
    var urlSearchEmail = '';

    if (cliente["nombre"] !== null && cliente["nombre"] !== '' && typeof(cliente["nombre"]) !== 'undefined') {
        urlSearchNombre += '_queryFilter=givenName%20eq%20%27' + cliente["nombre"] + '%27';
        urlSearch = urlSearchNombre;
    }

    if (cliente["apellido"] !== null && cliente["apellido"] !== '' && typeof(cliente["apellido"]) !== 'undefined') {
        urlSearchApellido += '_queryFilter=surname%20eq%20%27' + cliente["apellido"] + '%27';
        urlSearch = urlSearchNombre != '' ? urlSearch + '&' + urlSearchApellido : urlSearchApellido;
    }

    if (cliente["email"] !== null && cliente["email"] !== '' && typeof(cliente["email"]) !== 'undefined') {
        urlSearchEmail += '_queryFilter=email%20eq%20%27' + cliente["email"] + '%27';
        urlSearch = urlSearchApellido != '' ? urlSearch + '&' + urlSearchEmail : urlSearchEmail;
    }

    console.log("URL PARA CONSULTA DE CLIENTE: " + urlSearch);

    var options = {
        'method': 'GET',
        'url': 'https://' + URL_SMX_CLOUD_CLIENTE + '/openidm/v1/managed/user/info?' + urlSearch,
        'headers': {
            'Authorization': 'Bearer ' + cliente["token"],
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    };
    request(options, function(error, response) {
        if (error) {
            console.log("RESPUESTA ERROR EN EL ROUTE [consultarCliente]: " + JSON.stringify(error));
            throw new Error(error);
        } else {
            console.log("RESPUESTA EN EL ROUTE [consultarCliente]: " + JSON.stringify(response));
            res.send(response.body);
        }
    });
});

router.post('/consultarDetalleVehiculo', function(req, res, next) {
    console.log("BODY EN EL ROUTE: " + JSON.stringify(req.body));

    var params = req.body;
    var vehicle_id = params.vehicle_id;
    var tenant_id = params.tenant_id;
    var access_token = params.access_token;

    console.log("VEHICLE ID: " + vehicle_id);
    console.log("TENAN ID: " + tenant_id);
    console.log("TOKEN: " + access_token);

    var options = {
        'method': 'GET',
        'url': 'https://' + URL_SMX_CLOUD_AUTO_DETALLE + '/vehicle-api/v1/vehicles/' + vehicle_id,
        'headers': {
            'Content-Type': 'application/json',
            'CV-Tenant-Id': tenant_id,
            'Authorization': 'Bearer ' + access_token
        }
    };
    request(options, function(error, response) {
        if (error) {
            console.log("RESPUESTA ERROR EN EL ROUTE [consultarDetalleVehiculo]: " + JSON.stringify(error));
            throw new Error(error);
        } else {
            console.log("RESPUESTA EN EL ROUTE [consultarDetalleVehiculo]: " + JSON.stringify(response));
            res.send(response.body);
        }
    });

});

router.post('/estatusLocalizacion', function(req, res, next) {

    var params = req.body;
    var vehicle_id = params.vehicle_id;
    var vin = params.vin;
    var access_token = params.access_token;

    var options = {
        'method': 'GET',
        'url': 'https://' + URL_SMX_CLOUD_TRAKING + '/telematicsservices/v1/vehicles/' + vehicle_id + '/locations/tracker',
        'headers': {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + access_token
        }
    };

    console.log('ESTATUS LOCALIZACION: FECHA [' + new Date().toLocaleString("es-MX", { timeZone: "America/Mexico_City" }) + '] PETICION: ' + JSON.stringify(options));

    request(options, function(error, response) {
        if (error) {
            console.log("RESPUESTA ERROR EN EL ROUTE [estatusLocalizacion]: " + JSON.stringify(error));
            throw new Error(error);
        } else {
            console.log("RESPUESTA EN EL ROUTE [estatusLocalizacion]: " + JSON.stringify(response));
            res.send(response.body);
        }
    });


});

router.post('/activarLocalizacion', function(req, res, next) {

    var params = req.body;
    var vehicle_id = params.vehicle_id;
    var vin = params.vin;
    var access_token = params.access_token;
    var session_id = params.sessionId;
    var correlation_id = params.correlationId;

    if (conf.isTest) {
        res.send('{"svcReqId": "11eafc04-48f3-470c-916e-c6725930TEST"}');
    } else {

        var options = {
            'method': 'POST',
            'url': 'https://' + URL_SMX_CLOUD_TRAKING + '/telematicsservices/v1/vehicles/' + vehicle_id + '/locations/tracker',
            'headers': {
                'Authorization': 'Bearer ' + access_token,
                'Content-Type': 'application/json',
                'CV-SessionId': session_id,
                'CV-Correlation-Id': correlation_id
            },
            body: JSON.stringify({
                "track": {
                    "type": "Theft",
                    "state": "Active"
                }
            })

        };

        console.log('ACTIVAR LOCALIZACION: FECHA [' + new Date().toLocaleString("es-MX", { timeZone: "America/Mexico_City" }) + '] PETICION: ' + JSON.stringify(options));

        request(options, function(error, response) {
            if (error) {
                console.log("RESPUESTA ERROR EN EL ROUTE [activarLocalizacion]: " + JSON.stringify(error));
                throw new Error(error);
            } else {
                console.log("RESPUESTA EN EL ROUTE [activarLocalizacion]: " + JSON.stringify(response));
                res.send(response.body);
            }
        });

    }
});

router.post('/cancelarLocalizacion', function(req, res, next) {

    var params = req.body;
    var vehicle_id = params.vehicle_id;
    var vin = params.vin;
    var access_token = params.access_token;

    var options = {
        'method': 'DELETE',
        'url': 'https://' + URL_SMX_CLOUD_TRAKING + '/telematicsservices/v1/vehicles/' + vehicle_id + '/locations/tracker',
        'headers': {
            'Authorization': 'Bearer ' + access_token
        }
    };

    console.log('CANCELAR LOCALIZACION: FECHA [' + new Date().toLocaleString("es-MX", { timeZone: "America/Mexico_City" }) + '] PETICION: ' + JSON.stringify(options));

    request(options, function(error, response) {
        if (error) {
            console.log("RESPUESTA ERROR EN EL ROUTE [cancelarLocalizacion]: " + JSON.stringify(error));
            throw new Error(error);
        } else {
            console.log("RESPUESTA EN EL ROUTE [cancelarLocalizacion]: " + JSON.stringify(response));
            res.send(response.body);
        }
    });
});

router.post('/bloquearLocalizacion', function(req, res, next) {


    var params = req.body;
    var vehicle_id = params.vehicle_id;
    var vin = params.vin;
    var access_token = params.access_token;
    var session_id = params.sessionId;
    var correlation_id = params.correlationId;

    console.log(">>> VEHICLE ID ANTES DE LA PETICION DEL BLOQUEO: " + vehicle_id);
    console.log(">>> SESSION ID ANTES DE LA PETICION DEL BLOQUEO: " + session_id);
    console.log(">>> CORRELATION ID ANTES DE LA PETICION DEL BLOQUEO: " + correlation_id);

    if (conf.isTest) {
        res.send('{"svcReqId": "11eafc04-48f3-470c-916e-c6725930TEST"}');
    } else {
        var options = {
            'method': 'PUT',
            'url': 'https://' + URL_SMX_CLOUD_TRAKING + '/telematicsservices/v1/vehicles/' + vehicle_id + '/locations/tracker',
            'headers': {
                'Authorization': 'Bearer ' + access_token,
                'Content-Type': 'application/json',
                'CV-SessionId': session_id,
                'CV-Correlation-Id': correlation_id
            },
            body: JSON.stringify({
                "track": {
                    "type": "Theft",
                    "state": "Block"
                }
            })

        };

        console.log('BLOQUEAR LOCALIZACION: FECHA [' + new Date().toLocaleString("es-MX", { timeZone: "America/Mexico_City" }) + '] PETICION: ' + JSON.stringify(options));

        request(options, function(error, response) {
            if (error) {
                console.log("RESPUESTA ERROR EN EL ROUTE [bloquearLocalizacion]: " + JSON.stringify(error));
                throw new Error(error);
            } else {
                console.log("RESPUESTA EN EL ROUTE [bloquearLocalizacion]: " + JSON.stringify(response));
                res.send(response.body);
            }
        });

    }


});

router.post('/aplazarLocalizacion', function(req, res, next) {

    var params = req.body;
    var vehicle_id = params.vehicle_id;
    var vin = params.vin;
    var access_token = params.access_token;

    var request = require('request');
    var options = {
        'method': 'PUT',
        'url': 'https://' + URL_SMX_CLOUD_TRAKING + '/telematicsservices/v1/vehicles/' + vehicle_id + '/locations/tracker',
        'headers': {
            'Authorization': 'Bearer ' + access_token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "track": {
                "type": "Theft",
                "state": "Extend"
            }
        })

    };

    console.log('APLAZAR LOCALIZACION: FECHA [' + new Date().toLocaleString("es-MX", { timeZone: "America/Mexico_City" }) + '] PETICION: ' + JSON.stringify(options));

    request(options, function(error, response) {
        if (error) {
            console.log("RESPUESTA ERROR EN EL ROUTE [aplazarLocalizacion]: " + JSON.stringify(error));
            throw new Error(error);
        } else {
            console.log("RESPUESTA EN EL ROUTE [aplazarLocalizacion]: " + JSON.stringify(response));
            res.send(response.body);
        }
    });
});

router.get('/getTokenMzone', function(req, res, next) {

    var options = {
        'method': 'POST',
        'url': URL_MZONE_TOKEN,
        'headers': {
            'Accept': '*/*',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: {
            'grant_type': GRANT_TYPE_MZONE,
            'client_id': CLIENT_ID_MZONE,
            'client_secret': CLIENT_SECRET_MZONE,
            'scope': SCOPE_MZONE,
            'username': USERNAME_MZONE,
            'password': PASSWORD_MZONE
        }
    };
    request(options, function(error, response) {
        if (error) {
            console.log("RESPUESTA ERROR EN EL ROUTE [getTokenMzone]: " + JSON.stringify(error));
            throw new Error(error);
        } else {
            console.log("RESPUESTA EN EL ROUTE [getTokenMzone]: " + JSON.stringify(response));
            res.send(response.body);
        }
    });

});

router.get('/getTokenMzoneHija', function(req, res, next) {

    var options = {
        'method': 'POST',
        'url': URL_MZONE_TOKEN,
        'headers': {
            'Accept': '*/*',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: {
            'grant_type': GRANT_TYPE_MZONE,
            'client_id': CLIENT_ID_MZONE,
            'client_secret': CLIENT_SECRET_MZONE,
            'scope': SCOPE_MZONE,
            'username': USERNAME_MZONE_HIJA,
            'password': PASSWORD_MZONE_HIJA
        }
    };
    request(options, function(error, response) {
        if (error) {
            console.log("RESPUESTA ERROR EN EL ROUTE [getTokenMzone]: " + JSON.stringify(error));
            throw new Error(error);
        } else {
            console.log("RESPUESTA EN EL ROUTE [getTokenMzone]: " + JSON.stringify(response));
            res.send(response.body);
        }
    });

});

router.post('/getShellsMzone', function(req, res, next) {

    var token = req.body;

    var options = {
        'method': 'GET',
        'url': 'https://live.mzoneweb.net/mzone62.api/Vehicles?$format=json&$count=true&$select=id,unit_Description,unit_Id,vehicleType_Id,utcStartDate,cofDueDate,purchaseDate,description,registration,vin&$orderby=registration&$skip=0&$top=1000&$filter=vehicleGroups/any(x:%20x/id%20eq%20b89325c2-89cb-4af2-8445-70b24749a780)',
        'headers': {
            'Authorization': 'Bearer ' + token.token
        }
    };
    request(options, function(error, response) {
        if (error) {
            console.log("RESPUESTA ERROR EN EL ROUTE [getShellsMzone]: " + JSON.stringify(error));
            throw new Error(error);
        } else {
            console.log("RESPUESTA EN EL ROUTE [getShellsMzone]: " + JSON.stringify(response));
            res.send(response.body);
        }
    });

});

router.post('/updateShellsMzone', function(req, res, next) {

    //console.log("REQUEST EN [updateShellMzone]: "+JSON.stringfy(req.body));

    var shell = req.body;
    var token = shell.token;

    var options = {
        'method': 'PUT',
        'url': 'https://live.mzoneweb.net/mzone62.api/Vehicles(' + shell.vehicle_Id + ')',
        'headers': {
            'Authorization': 'Bearer ' + shell.token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "unit_Description": shell.id,
            "unit_Id": shell.unit_Id,
            "vehicleType_Id": shell.vehicleType_Id,
            "utcStartDate": shell.utcStartDate,
            "cofDueDate": shell.cofDueDate,
            "purchaseDate": shell.purchaseDate,
            "description": shell.description,
            "registration": shell.registration,
            "vin": shell.vin,
            "isFavorite": shell.isFavorite
        })
    };

    console.log('ACTUALIZAR PERFIL MZONE: FECHA [' + new Date().toLocaleString("es-MX", { timeZone: "America/Mexico_City" }) + '] PETICION: ' + JSON.stringify(options));

    request(options, function(error, response) {
        if (error) {
            console.log("ACTUALIZAR PERFIL MZONE: RESPUESTA ERROR EN EL ROUTE [updateShellsMzone]: " + JSON.stringify(error));
            throw new Error(error);
        } else {
            console.log("ACTUALIZAR PERFIL MZONE: RESPUESTA EN EL ROUTE [updateShellsMzone]: " + JSON.stringify(response));
            res.send(response.body);
        }
    });

});

module.exports = router;