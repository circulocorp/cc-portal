var environment = require('../routes/sirius_config.js');
var conf;
environment.environment === "STAGIN" ? conf = require('../routes/sirius_staging.js') : environment.environment === "PROD" ? conf = require('../routes/sirius_prod.js') : conf = require('../routes/sirius_dev.js');

var express = require('express');
var request = require('request');
var secrets = require('docker-secrets-nodejs');
var router = express.Router();


const Pool = require('pg').Pool;
const pool = new Pool({
    host: conf.host,
    database: conf.database,
    user: conf.user,
    password: conf.password,
    port: conf.port
});

router.post('/getUsuario', function(req, res, next) {
    console.log("BODY EN EL REPOSITORY [getUsuario]: " + JSON.stringify(req.body));

    var data = req.body;
    var sql = "SELECT * FROM users us WHERE us.user=$1 AND us.password=$2 AND us.status=true";

    pool.query(sql, [data.usuario, data.password], (error, results) => {
        if (error) {
            console.log("ERROR AL CONSULTAR EL USUARIO: " + error);
            throw new Error(error);
        } else {
            console.log("RESULTADO AL CONSULTAR EL USUARIO: " + JSON.stringify(results));
            console.log("RESULTADO AL CONSULTAR EL USUARIO: " + JSON.stringify(environment.environment));
            var env = environment.environment;
            env = env.replace(/["]+/g, '');
            console.log("RESULTADO AL CONSULTAR EL USUARIO: " + JSON.stringify(env));

            if (results.rows !== null && results.rows.length > 0) {
                res.status(200).json({ "status": true, "message": "Consulta de usuario con exito", "usuario": results.rows, "environment": env });
            } else {
                res.status(200).json({ "status": true, "message": "No se encontro información", "usuario": results.rows, "environment": env });
            }

        }
    });
});

router.get('/getTenans', function(req, res, next) {

    var data = req.body;
    var sql = "SELECT * FROM tenan b WHERE b.status=true";

    pool.query(sql, [], (error, results) => {
        if (error) {
            console.log("ERROR AL CONSULTAR LOS TENANS: " + error);
            throw new Error(error);
        } else {
            console.log("RESULTADO AL CONSULTAR LOS TENANS: " + JSON.stringify(results));

            if (results.rows !== null && results.rows.length > 0) {
                res.status(200).json({ "status": true, "message": "Consulta de tenans con exito", "tenans": results.rows });
            } else {
                res.status(200).json({ "status": true, "message": "No se encontro información", "tenans": null });
            }

        }
    });
});

router.post('/saveTracker', function(req, res, next) {
    console.log("BODY EN EL REPOSITORY [saveTracker]: " + JSON.stringify(req.body));

    var data = req.body;
    var sql = 'INSERT INTO tracker(vin, session_id, svc_req_id, event_type) VALUES ($1, $2, $3, $4) RETURNING tracker_id';

    pool.query(sql, [data.vin, data.sessionId, data.svcReqId, data.eventType], (error, results) => {
        if (error) {
            console.log("ERROR AL REGISTRAR EL TRACKER: " + error);
            throw new Error(error);
        } else {
            console.log("RESULTADO AL REGISTRAR EL TRACKER: : " + JSON.stringify(results));
            res.status(200).json({ "status": true, "message": "Registro de tracker con exito", "tracker": results.rows });
        }
    });
});

router.post('/deleteTracker', function(req, res, next) {
    console.log("BODY EN EL REPOSITORY [deleteTracker]: " + JSON.stringify(req.body));

    var data = req.body;
    var sql = 'DELETE FROM tracker WHERE vin=$1';

    pool.query(sql, [data.vin], (error, results) => {
        if (error) {
            console.log("ERROR AL ELIMINAR EL TRACKER: " + error);
            throw new Error(error);
        } else {
            console.log("RESULTADO AL ELIMINAR EL TRACKER: : " + JSON.stringify(results));
            res.status(200).json({ "status": true, "message": "Eliminación de tracker con exito", "tracker": results.rows });
        }

    });
});

router.post('/getTracker', function(req, res, next) {
    console.log("BODY EN EL REPOSITORY [getTracker]: " + JSON.stringify(req.body));

    var data = req.body;
    var sql = "SELECT * FROM tracker WHERE vin=$1 AND event_type='ACTIVE_TRACKER' ORDER BY tracker_id ASC LIMIT 1";

    pool.query(sql, [data.vin], (error, results) => {
        if (error) {
            console.log("ERROR AL CONSULTAR EL TRACKER POR vin [" + data.vin + "]: " + error);
            throw new Error(error);
        } else {
            console.log("RESULTADO AL CONSULTAR EL TRACKER: : " + JSON.stringify(results));
            res.status(200).json({ "status": true, "message": "Consulta de tracker con exito", "tracker": results.rows });
        }
    });
});

router.post('/getShells', function(req, res, next) {
    console.log("BODY EN EL REPOSITORY [getShellsSirius]: " + JSON.stringify(req.body));

    var data = req.body;
    var sql = "SELECT * FROM shells_mprofile ORDER BY id ASC";

    pool.query(sql, [], (error, results) => {
        if (error) {
            console.log("ERROR AL CONSULTAR LOS SHELLS MPROFILE: " + error);
            throw new Error(error);
        } else {
            console.log("RESULTADO AL CONSULTAR LOS SHELLS MPROFILE: " + JSON.stringify(results));
            if (results.rows !== null && results.rows.length > 0) {
                res.status(200).json({ "status": true, "message": "Consulta de shells con exito", "shells": results.rows });
            } else {
                res.status(200).json({ "status": true, "message": "No se encontro información", "shells": results.rows });
            }

        }
    });
});

router.post('/saveShell', function(req, res, next) {
    console.log("BODY EN EL REPOSITORY [saveShell]: " + JSON.stringify(req.body));

    var data = req.body;
    var sql = "INSERT INTO shells_mprofile( id, \"vehicle_Id\", \"unit_Id\", \"vehicleType_Id\", \"utcStartDate\", \"cofDueDate\", \"purchaseDate\", registration, vin, \"isFavorite\", status, \"lastUpdate\", description) " +
        "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id";

    pool.query(sql, [data.id, data.vehicle_Id, data.unit_Id, data.vehicleType_Id, data.utcStartDate, data.cofDueDate, data.purchaseDate, data.registration, data.vin, data.isFavorite, data.status, data.lastUpdate, data.description], (error, results) => {
        if (error) {
            console.log("ERROR AL REGISTRAR EL SHELL: " + error);
            throw new Error(error);
        } else {
            console.log("RESULTADO AL REGISTRAR EL SHELL: : " + JSON.stringify(results));
            res.status(200).json({ "status": true, "message": "Registro de tracker con exito" });
        }
    });
});

router.post('/updateShell', function(req, res, next) {
    console.log("BODY EN EL REPOSITORY [updateShell]: " + JSON.stringify(req.body));

    var data = req.body;
    var sql = "UPDATE shells_mprofile " +
        "SET  \"vehicle_Id\"=$2, \"unit_Id\"=$3, \"vehicleType_Id\"=$4, \"utcStartDate\"=$5, \"cofDueDate\"=$6, \"purchaseDate\"=$7, registration=$8, vin=$9, \"isFavorite\"=$10, status=$11, \"lastUpdate\"=$12, description=$13" +
        "WHERE id=$1 AND \"vehicle_Id\" = $2";

    pool.query(sql, [data.id, data.vehicle_Id, data.unit_Id, data.vehicleType_Id, data.utcStartDate, data.cofDueDate, data.purchaseDate, data.registration, data.vin, data.isFavorite, data.status, data.lastUpdate, data.description], (error, results) => {
        if (error) {
            console.log("ERROR AL ACTUALIZAR EL SHELL: " + error);
            throw new Error(error);
        } else {
            console.log("RESULTADO AL ACTUALIZAR EL SHELL: : " + JSON.stringify(results));
            res.status(200).json({ "status": true, "message": "Actualización de shell con exito" });
        }
    });
});

router.post('/getShellByStatus', function(req, res, next) {
    console.log("BODY EN EL REPOSITORY [getShellByStatus]: " + JSON.stringify(req.body));

    var data = req.body;
    var sql = "SELECT * FROM shells_mprofile WHERE  \"isFavorite\"=false AND status=false ORDER BY id ASC LIMIT 1";

    pool.query(sql, [], (error, results) => {
        if (error) {
            console.log("ERROR AL CONSULTAR EL SHELL POR STATUS [" + data.vin + "]: " + error);
            throw new Error(error);
        } else {
            console.log("RESULTADO AL CONSULTAR EL SHELL POR STATUS:  " + JSON.stringify(results));
            res.status(200).json({ "status": true, "message": "Consulta de tracker con exito", "shell": results.rows });
        }
    });
});

router.post('/getShellByVIN', function(req, res, next) {
    console.log("BODY EN EL REPOSITORY [getShellByVIN]: " + JSON.stringify(req.body));

    var data = req.body;
    var sql = "SELECT * FROM shells_mprofile WHERE vin=$1 AND  \"isFavorite\"=true AND status=true ORDER BY id ASC LIMIT 1";

    pool.query(sql, [data.vin], (error, results) => {
        if (error) {
            console.log("ERROR AL CONSULTAR EL SHELL POR VIN [" + data.vin + "]: " + error);
            throw new Error(error);
        } else {
            console.log("RESULTADO AL CONSULTAR EL SHELL POR VIN:  " + JSON.stringify(results));
            res.status(200).json({ "status": true, "message": "Consulta de tracker con exito", "shell": results.rows });
        }
    });
});

router.post('/getLogs', function(req, res, next) {
    console.log("BODY EN EL REPOSITORY [getLogs]: " + JSON.stringify(req.body));

    var data = req.body;
    var queryUsuario = "";
    var queryFecha = "";

    console.log("DATA EN EL REPOSITORY [getLogs]: " + data);
    console.log("USUARIO EN EL REPOSITORY [getLogs]: " + data.usuario);
    console.log("FECHAINI EN EL REPOSITORY [getLogs]: " + data.fechaIni);
    console.log("FECHAFIN EN EL REPOSITORY [getLogs]: " + data.fechaFin);

    if (data !== null && data !== "" && data !== "undefined") {
        if (data.usuario !== null && data.usuario !== "" && typeof(data.usuario) !== "undefined") {
            queryUsuario = "AND (user_name LIKE '%" + data.usuario + "%' OR user_email LIKE '%" + data.usuario + "%') ";
        }

        if ((data.fechaIni !== null && data.fechaIni !== "" && typeof(data.fechaIni) !== "undefined") && (data.fechaFin !== null && data.fechaFin !== "" && typeof(data.fechaFin) !== "undefined")) {
            queryFecha = "AND (TO_TIMESTAMP(created_date, 'YYYY/MM/DD HH24:MI:SS') >= TO_TIMESTAMP('" + data.fechaIni + "', 'YYYY/MM/DD HH24:MI:SS') AND TO_TIMESTAMP(created_date, 'YYYY/MM/DD HH24:MI:SS') <= TO_TIMESTAMP('" + data.fechaFin + "', 'YYYY/MM/DD HH24:MI:SS')) ";
        }
    }


    var sql = "SELECT * FROM system_events " +
        "WHERE 1=1 " +
        queryUsuario +
        queryFecha +
        "ORDER BY created_date DESC ";

    pool.query(sql, [], (error, results) => {
        if (error) {
            console.log("ERROR AL CONSULTAR LOS LOGS SIRIUS: " + error);
            throw new Error(error);
        } else {
            console.log("RESULTADO AL CONSULTAR LOS LOGS SIRIUS: " + JSON.stringify(results));
            if (results.rows !== null && results.rows.length > 0) {
                res.status(200).json({ "status": true, "message": "Consulta de logs con exito", "logs": results.rows });
            } else {
                res.status(200).json({ "status": true, "message": "No se encontro información", "logs": results.rows });
            }

        }
    });
});

router.post('/saveSystemEvents', function(req, res, next) {
    console.log("BODY EN EL REPOSITORY [saveSystemEvents]: " + JSON.stringify(req.body));

    var data = req.body;
    var sql = 'INSERT INTO system_events(created_date, user_email, user_name, action, observations) VALUES ($1, $2, $3, $4, $5) RETURNING id';

    pool.query(sql, [data.date, data.userEmail, data.userName, data.action, data.observation], (error, results) => {
        if (error) {
            console.log("ERROR AL REGISTRAR EL SYSTEMEVENT: " + error);
            throw new Error(error);
        } else {
            console.log("RESULTADO AL REGISTRAR EL SYSTEMEVENT: : " + JSON.stringify(results));
            res.status(200).json({ "status": true, "message": "Registro de systemevent con exito", "systemEvent": results.rows });
        }
    });
});

router.post('/getRequestMapByUser', function(req, res, next) {
    console.log("BODY EN EL REPOSITORY [getRequestMapByUser]: " + JSON.stringify(req.body));

    var data = req.body;
    var queryUsuario = data.user;

    console.log("DATA EN EL REPOSITORY [getRequestMapByUser]: " + data);
    console.log("USUARIO EN EL REPOSITORY [getRequestMapByUser]: " + data.user);
    var sql = "SELECT " +
        "url_permission " +
        "FROM request_map " +
        "WHERE user_email = '" + data.user + "'";

    pool.query(sql, [], (error, results) => {
        if (error) {
            console.log("ERROR AL CONSULTAR LOS REQUEST MAP: " + error);
            throw new Error(error);
        } else {
            console.log("RESULTADO AL CONSULTAR LOS REQUEST MAP: " + JSON.stringify(results));
            if (results.rows !== null && results.rows.length > 0) {
                res.status(200).json({ "status": true, "message": "Consulta de request_map con exito", "request_map": results.rows });
            } else {
                res.status(200).json({ "status": true, "message": "No se encontro información", "request_map": results.rows });
            }
        }
    });
});

module.exports = router;