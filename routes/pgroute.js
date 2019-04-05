var express = require('express');
var request = require('request');
var secrets = require('docker-secrets-nodejs');
var router = express.Router();


var pg_host = process.env.PG_HOST | "192.168.1.71";
var pg_user = process.env.PG_USER | "circulocorp";
var pg_pass = secrets.get("pg_pass");

const Pool = require('pg').Pool;

const pool = new Pool({
  user: pg_user,
  host: pg_host,
  database: 'sos',
  password: pg_pass,
  port: 5432,
});


router.get('/ordenes', function(req, res, next){
	pool.query('SELECT * FROM saph_orden_servicio_hist order by ordservh_c_servicio asc limit 1', (error, results) => {
    if (error) {
      console.log(error);
    }
    res.status(200).json(results.rows);
  });
});


router.post('/ordenes', function(req, res, next){
	var data = req.body;
	var sql = "SELECT hist.*,marcas.mrc_n_marca,clientes.cte_n_nombre \
	        FROM saph_orden_servicio_hist hist, circ_ope_orden_serv.sapc_cliente clientes,circ_ope_orden_serv.svcc_marcas marcas \
	        WHERE hist.cte_c_cliente = clientes.cte_c_cliente \
	        and hist.mrc_c_marca = marcas.mrc_c_marca ";
	if(data != null) {
		if(data.id)
			sql = sql + " and hist.ordservh_c_servicio::text like '%"+data.id+"%' ";
		if(data.imei)
			sql = sql + " and hist.ordserv_d_imei_modem_gps::text like '%"+data.imei+"%' ";

		if(data.cliente)
			sql = sql + " and UPPER(clientes.cte_n_nombre) like '%"+data.cliente.toUpperCase()+"%'";
		if(data.placas)
			sql = sql + " and UPPER(hist.ordserv_d_placas) like '%"+data.placas.toUpperCase()+"%'";
		if(data.marca)
			sql = sql + " and UPPER(marcas.mrc_n_marca) like '%"+data.marca.toUpperCase()+"%'";
		if(data.linea)
			sql = sql + " and hist.ordserv_d_linea_cel::text like '%"+data.linea+"%' ";
	}

	sql = sql + " order by hist.ordservh_c_servicio asc limit 100";
	pool.query(sql,(error, results) => {
    if (error) {
      console.log(error);
    }
    res.status(200).json(results.rows);
  });
});

module.exports = router;