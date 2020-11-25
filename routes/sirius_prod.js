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
exports.URL_SMX_CLOUD = "https://access.cv000-telematics.net/auth/oauth2/realms/root/realms/nissanmx/access_token";
exports.GRANT_TYPE_SMX_CLOUD = 'password';
exports.CLIENT_ID_SMX_CLOUD = 'nmx-svl-696f-473d-818a-dc4d909f85475';
exports.CLIENT_SECRET_SMX_CLOUD = 'P9EAjpyTHvw4vKNJxHymvaQUMqLHWXUB7XrS';
exports.SCOPE_SMX_CLOUD = 'rts';
exports.USERNAME_SMX_CLOUD = 'sa-circulo-svl-nissanmx';
exports.PASSWORD_SMX_CLOUD = 'h%#thB&8hT9PY9bH$zUvE6vCm%XrVFJRq';
exports.TENANT_ID_SMX_CLOUD = 'Nissanmx';

//Variables para EndPoint: consultarCliente
exports.CV_APP_TYPE = "OTHER";
exports.CV_API_KEY = "C37712F28F9F418E9580033D4601987E";

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

//Variables para la conexion a la base de datos
//Cambiar los siguieentes valores dependiendo el servidor
//Para el servidor actual de los servicios: exports.password = "Pass$word01";
//Para el servidor SIRIUS: exports.host = "sirius.c1rv3iuqyhko.us-east-1.rds.amazonaws.com"; exports.password = "Pass$word01";
exports.host = "127.0.0.1";//"sirius.c1rv3iuqyhko.us-east-1.rds.amazonaws.com";
exports.database = "sirius";
exports.user = "postgres";
exports.password = "admin";//"Pass$word01";//
exports.port = 5432;

//COLOCAR ESTA VARIABLE EN FALSE AL SUBIR A PRODUCCION
exports.isTest = true;
exports.isTestCont = 0;
