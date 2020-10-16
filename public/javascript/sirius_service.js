
var app = angular.module('ccportal');
app.service('SiriusService', function ($http) {

    this.consultaTokenSXMIDMLogin = function () {

        return new Promise((resolve, reject) => {
            var respuesta = new Object();
            $http.get('./sirius_route/SXM-IDM-Login').then(function (response) {
                console.log("RESPONSE EN EL SERVICE [consultaTokenSXMIDMLogin]: " + JSON.stringify(response));
                var respuestaObject;
                var token;
                if (response['status'] === 200) {
                    respuestaObject = response['data'];
                    console.log("RESPUESTA OBJECT: " + JSON.stringify(respuestaObject));
                    if (respuestaObject !== null) {

                        if (respuestaObject['access_token'] !== null && respuestaObject['access_token'] !== '' && typeof (respuestaObject['access_token']) !== 'undefined') {
                            token = respuestaObject['access_token'];
                            console.log("TOKEN: " + token);
                            respuesta.error = false;
                            respuesta.status = null;
                            respuesta.message = null;
                            respuesta.token = token;
                            resolve(respuesta);
                        } else {
                            respuesta.error = true;
                            respuesta.status = 1001;
                            respuesta.message = respuestaObject['error_description'];
                            respuesta.token = token;
                            resolve(respuesta);
                        }

                    } else {
                        respuesta.error = true;
                        respuesta.status = response['status'];
                        respuesta.message = response['message'];
                        respuesta.token = null;
                        resolve(respuesta);
                    }
                } else {
                    respuesta.error = true;
                    respuesta.status = response['status'];
                    respuesta.message = response['message'];
                    respuesta.token = null;
                    resolve(respuesta);
                }
            });
        });
    };

    this.consultaCliente = function (cliente) {

        return new Promise((resolve, reject) => {
            var respuesta = new Object();
            $http.post('./sirius_route/consultarCliente', cliente).then(function (response) {
                console.log("RESPONSE EN EL SERVICE [consultaCliente]: " + JSON.stringify(response));
                var respuestaObject;
                var listaClientes = [];
                if (response['status'] === 200) {
                    respuestaObject = response['data'];
                    console.log("RESPUESTA OBJECT: " + JSON.stringify(respuestaObject));
                    if (respuestaObject !== null) {

                        if (Array.isArray(response['data'])) {

                            listaClientes = response['data'];
                            if (typeof (listaClientes) !== 'undefined' && listaClientes !== null && listaClientes.length !== null && listaClientes.length > 0) {

                                listaClientes.forEach(function (valor, indice, array) {
                                    valor.isSelected = false;
                                });
                                respuesta.error = false;
                                respuesta.status = null;
                                respuesta.message = null;
                                respuesta.lista = listaClientes;
                                resolve(respuesta);
                            } else {
                                respuesta.error = true;
                                respuesta.status = 1002;
                                respuesta.message = "No se encontraron resultados.";
                                respuesta.lista = null;
                                resolve(respuesta);
                            }
                        } else {
                            respuesta.error = true;
                            respuesta.status = respuestaObject['status'];
                            respuesta.message = respuestaObject['message'];
                            respuesta.lista = null;
                            resolve(respuesta);
                        }
                    } else {
                        respuesta.error = true;
                        respuesta.status = response['status'];
                        respuesta.message = response['message'];
                        respuesta.token = null;
                        resolve(respuesta);
                    }
                } else {
                    respuesta.error = true;
                    respuesta.status = response['status'];
                    respuesta.message = response['message'];
                    respuesta.lista = null;
                    resolve(respuesta);
                }
            });
        });
    };

    this.consultaTokenSXMCloud = function () {

        return new Promise((resolve, reject) => {
            var respuesta = new Object();
            $http.get('./sirius_route/SXM-Cloud').then(function (response) {
                console.log("RESPONSE EN EL SERVICE [consultaTokenSXMCloud]: " + JSON.stringify(response));
                var respuestaObject;
                var token;
                if (response['status'] === 200) {
                    respuestaObject = response['data'];
                    console.log("RESPUESTA OBJECT: " + JSON.stringify(respuestaObject));
                    if (respuestaObject !== null) {

                        if (respuestaObject['access_token'] !== null && respuestaObject['access_token'] !== '' && typeof (respuestaObject['access_token']) !== 'undefined') {
                            token = respuestaObject['access_token'];
                            console.log("TOKEN: " + token);
                            respuesta.error = false;
                            respuesta.status = null;
                            respuesta.message = null;
                            respuesta.token = token;
                            resolve(respuesta);
                        } else {
                            respuesta.error = true;
                            respuesta.status = 1001;
                            respuesta.message = respuestaObject['error_description'];
                            respuesta.token = null;
                            resolve(respuesta);
                        }

                    } else {
                        respuesta.error = true;
                        respuesta.status = response['status'];
                        respuesta.message = response['message'];
                        respuesta.token = null;
                        resolve(respuesta);
                    }
                } else {
                    respuesta.error = true;
                    respuesta.status = response['status'];
                    respuesta.message = response['message'];
                    respuesta.token = null;
                    resolve(respuesta);
                }
            });
        });
    };

    this.consultaEstatusLocalizacion = function (vinRequest) {

        console.log("VIN REQUEST EN EL SERVICE [consultaEstatusLocalizacion]: " + JSON.stringify(vinRequest));
        return new Promise((resolve, reject) => {
            var respuesta = new Object();
            $http.post('./sirius_route/estatusLocalizacion', vinRequest).then(function (response) {
                console.log("RESPONSE EN EL SERVICE [consultaEstatusLocalizacion]: " + JSON.stringify(response));
                var respuestaObject;
                var tracker;
                if (response['status'] === 200) {
                    respuestaObject = response['data'];
                    console.log("RESPUESTA OBJECT: " + JSON.stringify(respuestaObject));
                    if (respuestaObject !== null && respuestaObject !== "" && typeof (respuestaObject) !== "") {
                        console.log("ENTRO EN EL IF: ");
                        if (Object.entries(respuestaObject).length === 0) {
                            respuesta.error = false;
                            respuesta.status = 1005;
                            respuesta.message = "La localización no se encuentra activa";
                            respuesta.tracker = null;
                            resolve(respuesta);
                        } else {

                            if (respuestaObject['tracker'] !== null && respuestaObject['tracker'] !== '' && typeof (respuestaObject['tracker']) !== 'undefined') {
                                tracker = respuestaObject['tracker'];
                                console.log("TRACKER: " + JSON.stringify(tracker));
                                if (tracker['status'] === "ACTIVE") {
                                    respuesta.error = true;
                                    respuesta.status = 1004;
                                    respuesta.message = "La localización para el vehículo con el VIN " + vinRequest.vin + " ya se encuentra activa.";
                                    respuesta.tracker = tracker;
                                    resolve(respuesta);
                                } else {
                                    //aqui debe ir la validacion dle bloqueo dentro de un if
                                    respuesta.error = false;
                                    respuesta.status = null;
                                    respuesta.message = null;
                                    respuesta.tracker = null;
                                    resolve(respuesta);
                                }

                            } else {
                                respuesta.error = true;
                                respuesta.status = respuestaObject['status'];
                                respuesta.message = respuestaObject['message'];
                                respuesta.tracker = null;
                                resolve(respuesta);
                            }
                        }

                    } else {
                        console.log("ENTRO EN EL ELSE: ");
                        if (isEmpty(respuestaObject) || respuestaObject.length === 0) {
                            console.log("ENTRO EN EL IF 2: ");
                            respuesta.error = true;
                            respuesta.status = 1003;
                            respuesta.message = "No hay resultados";
                            respuesta.tracker = null;
                            resolve(respuesta);
                        } else {
                            console.log("ENTRO EN EL ELSE 2: ");
                            respuesta.error = true;
                            respuesta.status = response['status'];
                            respuesta.message = response['message'];
                            respuesta.tracker = null;
                            resolve(respuesta);
                        }

                    }
                } else {
                    respuesta.error = true;
                    respuesta.status = response['status'];
                    respuesta.message = response['message'];
                    respuesta.tracker = null;
                    resolve(respuesta);
                }
            });
        });
    };

    this.activarLocalizacion = function (vinRequest) {

        console.log("VIN REQUEST EN EL SERVICE [activarLocalizacion]: " + JSON.stringify(vinRequest));
        return new Promise((resolve, reject) => {
            var respuesta = new Object();
            $http.post('./sirius_route/activarLocalizacion', vinRequest).then(function (response) {
                console.log("RESPONSE EN EL SERVICE [activarLocalizacion]: " + JSON.stringify(response));
                var respuestaObject;
                if (response['status'] === 200) {
                    respuestaObject = response['data'];
                    console.log("RESPUESTA OBJECT: " + JSON.stringify(response['data']));
                    if (respuestaObject['svcReqId'] !== null && respuestaObject['svcReqId'] !== '' && typeof (respuestaObject['svcReqId']) !== 'undefined') {
                        respuesta.error = false;
                        respuesta.status = null;
                        respuesta.message = "Activación correcta";
                        respuesta.svcReqId = respuestaObject['svcReqId'];
                        resolve(respuesta);
                    } else {
                        respuesta.error = true;
                        respuesta.status = respuestaObject['status'];
                        respuesta.message = respuestaObject['message'];
                        respuesta.tracker = null;
                        resolve(respuesta);
                    }

                } else {
                    respuesta.error = true;
                    respuesta.status = response['status'];
                    respuesta.message = response['message'];
                    respuesta.tracker = null;
                    resolve(respuesta);
                }
            });
        });
    };

    this.cancelarLocalizacion = function (vinRequest) {

        console.log("VIN REQUEST EN EL SERVICE [cancelarLocalizacion]: " + JSON.stringify(vinRequest));
        return new Promise((resolve, reject) => {
            var respuesta = new Object();
            $http.post('./sirius_route/cancelarLocalizacion', vinRequest).then(function (response) {
                console.log("RESPONSE EN EL SERVICE [cancelarLocalizacion]: " + JSON.stringify(response));
                var respuestaObject;
                if (response['status'] === 200) {
                    respuestaObject = response['data'];
                    console.log("RESPUESTA OBJECT: " + JSON.stringify(response['data']));

                    if (Object.entries(respuestaObject).length === 0) {
                        respuesta.error = true;
                        respuesta.status = 1005;
                        respuesta.message = "La localización no se encuentra activa, no se puede aplicar la canleación.";
                        respuesta.tracker = null;
                        resolve(respuesta);
                    } else {
                        if (respuestaObject['svcReqId'] !== null && respuestaObject['svcReqId'] !== '' && typeof (respuestaObject['svcReqId']) !== 'undefined') {
                            respuesta.error = false;
                            respuesta.status = null;
                            respuesta.message = "La cancelación de la localización se realizo con exito.";
                            respuesta.svcReqId = respuestaObject['svcReqId'];
                            resolve(respuesta);
                        } else {
                            respuesta.error = true;
                            respuesta.status = respuestaObject['status'];
                            respuesta.message = respuestaObject['message'];
                            respuesta.tracker = null;
                            resolve(respuesta);
                        }
                    }

                } else {
                    respuesta.error = true;
                    respuesta.status = response['status'];
                    respuesta.message = response['message'];
                    respuesta.tracker = null;
                    resolve(respuesta);
                }
            });
        });
    };
});

