/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
//Variables para ambiente de produccion
//Variables para EndPoint: SXM-IDM-Login
exports.APIM_SERVER_NAME = "https://prd.api.telematics.net";
exports.GRANT_TYPE = "client_credentials";
exports.CLIENT_ID = "NISSAN_CIRCULO_SVL_MX";
exports.CLIENT_SECRET = "KkxCQUMzSXZ1azNTbE1FU0wxaVMkbC0rd3JVejMy";

//Variables para EndPoint: SXM-Cloud
exports.URL_SMX_CLOUD = "am.cv000-telematics.net";
exports.GRANT_TYPE_SMX_CLOUD = 'password';
exports.SCOPE_SMX_CLOUD = 'cps rts';

//VARIABLES PARA NISSANMX
exports.CLIENT_ID_SMX_CLOUD = 'nmx-svl-696f-473d-818a-dc4d909f85475';
exports.CLIENT_SECRET_SMX_CLOUD = 'P9EAjpyTHvw4vKNJxHymvaQUMqLHWXUB7XrS';
exports.USERNAME_SMX_CLOUD = 'sa-circulo-svl-nissanmx';
exports.PASSWORD_SMX_CLOUD = 'h%#thB&8hT9PY9bH$zUvE6vCm%XrVFJRq';

//VARIABLES PARA INFINIMX
exports.CLIENT_ID_SMX_CLOUD_INFINITI = 'infmx-svl-fb49-47ee-a926-6bd3cc653c2';
exports.CLIENT_SECRET_SMX_CLOUD_INFINITI = 'aZXZZ5a9WNDRCySKJjycGTuHSE64RpLGG5Jt';
exports.USERNAME_SMX_CLOUD_INFINITI = 'sa-circulo-svl-infinitimx';
exports.PASSWORD_SMX_CLOUD_INFINITI = 'QG6k%cT$8Bew4kyUGw!2@Pc!dasq@n5Wb';

//exports.TENANT_ID_SMX_CLOUD = 'Nissanmx';

//Variables para EndPoint: consultarCliente y consultarAuto
exports.URL_SMX_CLOUD_CLIENTE = "idm.cv000-telematics.net";
exports.URL_SMX_CLOUD_AUTO = "idm.cv000-telematics.net";
exports.URL_SMX_CLOUD_AUTO_DETALLE = "cps.cv000-telematics.net";
exports.URL_SMX_CLOUD_TRAKING = "rts.cv000-telematics.net";
//exports.CV_APP_TYPE = "OTHER";
//exports.CV_API_KEY = "C37712F28F9F418E9580033D4601987E";

//Variables para las acciones sobre el vehiculo
exports.VIN_EXECUTE_TRACKER = "";
exports.URL_EXECUTE_TRACKER = "https://rts.cv000-telematics.net/telematicsservices/v1/vehicles/";
exports.X_API_KEY_EXECUTE_TRACKER = "{{apikey}}";

//variables para la conexion con MZone
exports.URL_MZONE_TOKEN = "https://login.mzoneweb.net/connect/token";
exports.GRANT_TYPE_MZONE = "password";
exports.CLIENT_ID_MZONE = "mz-a3tek";
exports.CLIENT_SECRET_MZONE = "WJ4wUJo79qFsMm4T9Rj7dKw4";
exports.SCOPE_MZONE = "openid mz6-api.all mz_username";
exports.USERNAME_MZONE = "$1R1V$";
exports.PASSWORD_MZONE = "$1R1V$2020";

exports.USERNAME_MZONE_HIJA = "ADMIN@3461";
exports.PASSWORD_MZONE_HIJA = "A3TEKCC3461";

//Variables para la conexion a la base de datos
//Cambiar los siguieentes valores dependiendo el servidor
//Para el servidor actual de los servicios: exports.password = "Pass$word01";
//Para el servidor SIRIUS: exports.host = "sirius.c1rv3iuqyhko.us-east-1.rds.amazonaws.com"; exports.password = "Pass$word01";
exports.host = "localhost"; //"sirius.c1rv3iuqyhko.us-east-1.rds.amazonaws.com"; // 
exports.database = "sirius";
exports.user = "postgres";
exports.password = "root"; //"Pass$word01"; // 
exports.port = 5432;

//COLOCAR ESTA VARIABLE EN FALSE AL SUBIR A PRODUCCION
exports.isTest = false;
exports.isTestCont = 0;

exports.port_sirius = 3003;