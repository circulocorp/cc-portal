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

router.post('/saveTracker', function (req, res, next) {
    console.log("BODY EN EL REPOSITORY: " + JSON.stringify(req.body));

    var data = req.body;
    var sql = 'INSERT INTO sirius.tracker(vin, session_id, svc_req_id, event_type) VALUES ($1, $2, $3, $4) RETURNING tracker_id';

    pool.query(sql, [data.vin, data.sessionId, data.svcReqId, data.eventType], (error, results) => {
        if (error) {
            console.log("ERROR AL REGISTRAR EL TRACKER: " + error);
            throw new Error(error);
        } else {
            console.log("RESULTADO AL REGISTRAR EL TRACKER: : " + JSON.stringify(results));
            res.status(200).json({"status": true, "message": "Registro de tracker con exito"});
        }
    });
});

router.post('/deleteTracker', function (req, res, next) {
    console.log("PARAMETROS: " + JSON.stringify(req.body));

    var data = req.body;
    var sql = 'DELETE FROM sirius.tracker WHERE vin=$1';

    pool.query(sql, [data.vin], (error, results) => {
        if (error) {
            console.log("ERROR AL ELIMINAR EL TRACKER: " + error);
            throw new Error(error);
        } else {
            console.log("RESULTADO AL ELIMINAR EL TRACKER: : " + JSON.stringify(results));
            res.status(200).json({"status": true, "message": "Eliminación de tracker con exito"});
        }

    });
});

router.post('/getTracker', function (req, res, next) {
    console.log("PARAMETROS: " + JSON.stringify(req.body));

    var data = req.body;
    var sql = "SELECT * FROM sirius.tracker WHERE vin=$1 AND event_type='ACTIVE_TRACKER' ORDER BY tracker_id ASC LIMIT 1";

    pool.query(sql, [data.vin], (error, results) => {
        if (error) {
            console.log("ERROR AL CONSULTAR EL TRACKER POR vin [" + vin + "]: " + error);
            throw new Error(error);
        } else {
            console.log("RESULTADO AL CONSULTAR EL TRACKER: : " + JSON.stringify(results));
            res.status(200).json({"status": true, "message": "Consulta de tracker con exito", "tracker": results.rows});
        }
    });
});

module.exports = router;