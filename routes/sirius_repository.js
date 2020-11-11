var environment = require('../routes/sirius_config.js');
var conf;
environment.environment === "STAGIN" ? conf = require('../routes/sirius_staging.js') : conf = require('../routes/sirius_prod.js');

var express = require('express');
var request = require('request');
var secrets = require('docker-secrets-nodejs');
var router = express.Router();


const Pool = require('pg').Pool;
const pool = new Pool({
    host: conf.host, //'127.0.0.1',
    database: conf.database, //'sirius',
    user: conf.user, //'postgres',
    password: conf.password, //'root',
    port: conf.port//5432
});

router.post('/getUsuario', function (req, res, next) {
    console.log("BODY EN EL REPOSITORY [getUsuario]: " + JSON.stringify(req.body));

    var data = req.body;
    var sql = "SELECT * FROM users us WHERE us.user=$1 AND us.password=$2 AND us.status=true";

    pool.query(sql, [data.usuario, data.password], (error, results) => {
        if (error) {
            console.log("ERROR AL CONSULTAR EL USUARIO: " + error);
            throw new Error(error);
        } else {
            console.log("RESULTADO AL CONSULTAR EL USUARIO: " + JSON.stringify(results));
            if (results.rows !== null && results.rows.length > 0) {
                res.status(200).json({"status": true, "message": "Consulta de usuario con exito", "usuario": results.rows});
            } else {
                res.status(200).json({"status": true, "message": "No se encontro información", "usuario": results.rows});
            }

        }
    });
});

router.post('/saveTracker', function (req, res, next) {
    console.log("BODY EN EL REPOSITORY [saveTracker]: " + JSON.stringify(req.body));

    var data = req.body;
    var sql = 'INSERT INTO tracker(vin, session_id, svc_req_id, event_type) VALUES ($1, $2, $3, $4) RETURNING tracker_id';

    pool.query(sql, [data.vin, data.sessionId, data.svcReqId, data.eventType], (error, results) => {
        if (error) {
            console.log("ERROR AL REGISTRAR EL TRACKER: " + error);
            throw new Error(error);
        } else {
            console.log("RESULTADO AL REGISTRAR EL TRACKER: : " + JSON.stringify(results));
            res.status(200).json({"status": true, "message": "Registro de tracker con exito", "tracker": results.rows});
        }
    });
});

router.post('/deleteTracker', function (req, res, next) {
    console.log("BODY EN EL REPOSITORY [deleteTracker]: " + JSON.stringify(req.body));

    var data = req.body;
    var sql = 'DELETE FROM tracker WHERE vin=$1';

    pool.query(sql, [data.vin], (error, results) => {
        if (error) {
            console.log("ERROR AL ELIMINAR EL TRACKER: " + error);
            throw new Error(error);
        } else {
            console.log("RESULTADO AL ELIMINAR EL TRACKER: : " + JSON.stringify(results));
            res.status(200).json({"status": true, "message": "Eliminación de tracker con exito", "tracker": results.rows});
        }

    });
});

router.post('/getTracker', function (req, res, next) {
    console.log("BODY EN EL REPOSITORY [getTracker]: " + JSON.stringify(req.body));

    var data = req.body;
    var sql = "SELECT * FROM tracker WHERE vin=$1 AND event_type='ACTIVE_TRACKER' ORDER BY tracker_id ASC LIMIT 1";

    pool.query(sql, [data.vin], (error, results) => {
        if (error) {
            console.log("ERROR AL CONSULTAR EL TRACKER POR vin [" + data.vin + "]: " + error);
            throw new Error(error);
        } else {
            console.log("RESULTADO AL CONSULTAR EL TRACKER: : " + JSON.stringify(results));
            res.status(200).json({"status": true, "message": "Consulta de tracker con exito", "tracker": results.rows});
        }
    });
});

router.post('/getShells', function (req, res, next) {
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
                res.status(200).json({"status": true, "message": "Consulta de shells con exito", "shells": results.rows});
            } else {
                res.status(200).json({"status": true, "message": "No se encontro información", "shells": results.rows});
            }

        }
    });
});

router.post('/saveShell', function (req, res, next) {
    console.log("BODY EN EL REPOSITORY [saveShell]: " + JSON.stringify(req.body));

    var data = req.body;
    var sql = "INSERT INTO shells_mprofile( id, \"vehicle_Id\", \"unit_Id\", \"vehicleType_Id\", \"utcStartDate\", \"cofDueDate\", \"purchaseDate\", registration, vin, \"isFavorite\", status, \"lastUpdate\", description) "
            + "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id";

    pool.query(sql, [data.id, data.vehicle_Id, data.unit_Id, data.vehicleType_Id, data.utcStartDate, data.cofDueDate, data.purchaseDate, data.registration, data.vin, data.isFavorite, data.status, data.lastUpdate, data.description], (error, results) => {
        if (error) {
            console.log("ERROR AL REGISTRAR EL SHELL: " + error);
            throw new Error(error);
        } else {
            console.log("RESULTADO AL REGISTRAR EL SHELL: : " + JSON.stringify(results));
            res.status(200).json({"status": true, "message": "Registro de tracker con exito"});
        }
    });
});

router.post('/updateShell', function (req, res, next) {
    console.log("BODY EN EL REPOSITORY [updateShell]: " + JSON.stringify(req.body));

    var data = req.body;
    var sql = "UPDATE shells_mprofile "
            + "SET  \"vehicle_Id\"=$2, \"unit_Id\"=$3, \"vehicleType_Id\"=$4, \"utcStartDate\"=$5, \"cofDueDate\"=$6, \"purchaseDate\"=$7, registration=$8, vin=$9, \"isFavorite\"=$10, status=$11, \"lastUpdate\"=$12, description=$13"
            + "WHERE id=$1 AND \"vehicle_Id\" = $2";

    pool.query(sql, [data.id, data.vehicle_Id, data.unit_Id, data.vehicleType_Id, data.utcStartDate, data.cofDueDate, data.purchaseDate, data.registration, data.vin, data.isFavorite, data.status, data.lastUpdate, data.description], (error, results) => {
        if (error) {
            console.log("ERROR AL ACTUALIZAR EL SHELL: " + error);
            throw new Error(error);
        } else {
            console.log("RESULTADO AL ACTUALIZAR EL SHELL: : " + JSON.stringify(results));
            res.status(200).json({"status": true, "message": "Actualización de shell con exito"});
        }
    });
});

router.post('/getShellByStatus', function (req, res, next) {
    console.log("BODY EN EL REPOSITORY [getShellByStatus]: " + JSON.stringify(req.body));

    var data = req.body;
    var sql = "SELECT * FROM shells_mprofile WHERE  \"isFavorite\"=false AND status=false ORDER BY id ASC LIMIT 1";

    pool.query(sql, [], (error, results) => {
        if (error) {
            console.log("ERROR AL CONSULTAR EL SHELL POR STATUS [" + data.vin + "]: " + error);
            throw new Error(error);
        } else {
            console.log("RESULTADO AL CONSULTAR EL SHELL POR STATUS:  " + JSON.stringify(results));
            res.status(200).json({"status": true, "message": "Consulta de tracker con exito", "shell": results.rows});
        }
    });
});

router.post('/getShellByVIN', function (req, res, next) {
    console.log("BODY EN EL REPOSITORY [getShellByVIN]: " + JSON.stringify(req.body));

    var data = req.body;
    var sql = "SELECT * FROM shells_mprofile WHERE vin=$1 AND  \"isFavorite\"=true AND status=true ORDER BY id ASC LIMIT 1";

    pool.query(sql, [data.vin], (error, results) => {
        if (error) {
            console.log("ERROR AL CONSULTAR EL SHELL POR VIN [" + data.vin + "]: " + error);
            throw new Error(error);
        } else {
            console.log("RESULTADO AL CONSULTAR EL SHELL POR VIN:  " + JSON.stringify(results));
            res.status(200).json({"status": true, "message": "Consulta de tracker con exito", "shell": results.rows});
        }
    });
});

module.exports = router;