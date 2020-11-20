var app = angular.module('ccportal');

app.service('SiriusService', function ($http) {

    this.consultaTokenSXMIDMLogin = function () {

        return new Promise((resolve, reject) => {
            var respuesta = new Object();
            $http.get('./sirius_route/SXM-IDM-Login').then(function (response) {
                console.log("RESPUESTA EN EL SERVICE [consultaTokenSXMIDMLogin]: " + JSON.stringify(response));

                var respuestaObject;
                var token;

                if (response['status'] === 200) {
                    respuestaObject = response['data'];

                    if (respuestaObject !== null) {

                        if (respuestaObject['access_token'] !== null && respuestaObject['access_token'] !== '' && typeof (respuestaObject['access_token']) !== 'undefined') {
                            token = respuestaObject['access_token'];

                            respuesta.error = false;
                            respuesta.status = 200;
                            respuesta.message = "Consulta exitosa";
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

    this.consultaTokenSXMCloud = function () {

        return new Promise((resolve, reject) => {
            var respuesta = new Object();
            $http.get('./sirius_route/SXM-Cloud').then(function (response) {
                console.log("RESPUESTA EN EL SERVICE [consultaTokenSXMCloud]: " + JSON.stringify(response));

                var respuestaObject;
                var token;

                if (response['status'] === 200) {
                    respuestaObject = response['data'];

                    if (respuestaObject !== null) {

                        if (respuestaObject['access_token'] !== null && respuestaObject['access_token'] !== '' && typeof (respuestaObject['access_token']) !== 'undefined') {
                            token = respuestaObject['access_token'];

                            respuesta.error = false;
                            respuesta.status = 200;
                            respuesta.message = "Consulta exitosa";
                            respuesta.token = token;
                            resolve(respuesta);
                        } else {
                            respuesta.error = true;
                            respuesta.status = 1002;
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

    this.consultaCliente = function (cliente) {

        return new Promise((resolve, reject) => {
            var respuesta = new Object();
            $http.post('./sirius_route/consultarCliente', cliente).then(function (response) {
                console.log("RESPUESTA EN EL SERVICE [consultaCliente]: " + JSON.stringify(response));

                var respuestaObject;
                var listaClientes = [];
                if (response['status'] === 200) {
                    respuestaObject = response['data'];

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
                                respuesta.status = 1003;
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

    this.consultaEstatusLocalizacion = function (vinRequest) {

        return new Promise((resolve, reject) => {
            var respuesta = new Object();
            $http.post('./sirius_route/estatusLocalizacion', vinRequest).then(function (response) {
                console.log("RESPUESTA EN EL SERVICE [consultaEstatusLocalizacion]: " + JSON.stringify(response));

                var respuestaObject;
                var tracker;

                if (response['status'] === 200) {
                    respuestaObject = response['data'];

                    if (respuestaObject !== null && respuestaObject !== "" && typeof (respuestaObject) !== "") {

                        if (Object.entries(respuestaObject).length === 0) {
                            respuesta.error = false;
                            respuesta.status = 1005;
                            respuesta.message = "El vehículo con el VIN: " + vinRequest.vin + " NO tiene una localización activa.\n" + JSON.stringify(respuestaObject);
                            respuesta.tracker = respuestaObject;
                            resolve(respuesta);
                        } else {

                            if (respuestaObject['tracker'] !== null && respuestaObject['tracker'] !== '' && typeof (respuestaObject['tracker']) !== 'undefined') {
                                tracker = respuestaObject['tracker'];

                                if (tracker['status'] === "ACTIVE") {
                                    respuesta.error = true;
                                    respuesta.status = 1006;
                                    respuesta.message = "La localización para el vehículo con el VIN " + vinRequest.vin + " ya se encuentra activa.\n " + JSON.stringify(tracker) + " ";
                                    respuesta.tracker = tracker;
                                    resolve(respuesta);
                                } else if (tracker['status'] === "FAILED") {
                                    respuesta.error = true;
                                    respuesta.status = 1007;
                                    respuesta.message = "La localización para el vehículo con el VIN " + vinRequest.vin + " tiene un estatus " + tracker['status'] + ".\n " + JSON.stringify(tracker) + "";
                                    respuesta.tracker = tracker;
                                    resolve(respuesta);
                                } else {
                                    respuesta.error = true;
                                    respuesta.status = 1008;
                                    respuesta.message = tracker['status'] + "\n " + JSON.stringify(tracker) + "";
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

                        if (isEmpty(respuestaObject) || respuestaObject.length === 0) {
                            respuesta.error = true;
                            respuesta.status = 1004;
                            respuesta.message = "No se encontro información sobre el Tracker para el VIN: " + vinRequest.vin + ".";
                            respuesta.tracker = null;
                            resolve(respuesta);
                        } else {
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

        console.log("VIN-REQUEST EN EL SERVICE: " + JSON.stringify(vinRequest));

        return new Promise((resolve, reject) => {
            var respuesta = new Object();
            $http.post('./sirius_route/activarLocalizacion', vinRequest).then(function (response) {
                console.log("RESPUESTA EN EL SERVICE [activarLocalizacion]: " + JSON.stringify(response));


                if (response['status'] === 200) {
                    var respuestaObject = response['data'];

                    if (respuestaObject['svcReqId'] !== null && respuestaObject['svcReqId'] !== '' && typeof (respuestaObject['svcReqId']) !== 'undefined') {

                        vinRequest.svcReqId = respuestaObject['svcReqId'];
                        vinRequest.eventType = "ACTIVE_TRACKER";

                        $http.post('./sirius_repository/saveTracker', vinRequest).then(function (response) {
                            console.log("RESPUESTA EN EL SERVICE [activarLocalizacion/saveTracker]: " + JSON.stringify(response));


                            if (response['status'] === 200) {
                                var respuestaSaveTarcker = response['data'];
                                console.log("RESPUESTA EN EL SERVICE [activarLocalizacion/saveTracker]: " + JSON.stringify(respuestaSaveTarcker));

                                $http.post('./sirius_repository/getShellByStatus', vinRequest).then(function (response) {
                                    console.log("RESPUESTA EN EL SERVICE [activarLocalizacion/getShellByStatus]: " + JSON.stringify(response));


                                    if (response['status'] === 200) {
                                        var respuestaGetShellTarcker = response['data'];
                                        console.log("RESPUESTA EN EL SERVICE [activarLocalizacion/getShellByStatus]: " + JSON.stringify(respuestaGetShellTarcker));

                                        if (respuestaGetShellTarcker['shell'] !== null && respuestaGetShellTarcker['shell'].length > 0) {
                                            var shell = respuestaGetShellTarcker['shell'][0];
                                            console.log("RESPUESTA EN EL SERVICE [activarLocalizacion/SHELL]: " + JSON.stringify(shell));

                                            shell.description = vinRequest.vin;
                                            shell.registration = vinRequest.vin;
                                            shell.vin = vinRequest.vin;
                                            shell.isFavorite = true;
                                            shell.status = true;
                                            shell.lastUpdate = moment().format('YYYY/MM/DD HH:mm:ss');

                                            $http.post('./sirius_repository/updateShell', shell).then(function (response) {
                                                console.log("RESPUESTA EN EL SERVICE [activarLocalizacion/updateShell]: " + JSON.stringify(response));


                                                if (response['status'] === 200) {
                                                    var respuestaUpdateShell = response['data'];
                                                    console.log("RESPUESTA EN EL SERVICE [activarLocalizacion/updateShell]: " + JSON.stringify(respuestaUpdateShell));

                                                    $http.get('./sirius_route/getTokenMzone').then(function (responseTokenMzone) {
                                                        console.log("RESPUESTA EN EL SERVICE [getTokenMzone]: " + JSON.stringify(responseTokenMzone));

                                                        var respuestaObject;
                                                        var token;

                                                        if (responseTokenMzone['status'] === 200) {
                                                            respuestaObject = responseTokenMzone['data'];

                                                            if (respuestaObject !== null) {

                                                                if (respuestaObject['access_token'] !== null && respuestaObject['access_token'] !== '' && typeof (respuestaObject['access_token']) !== 'undefined') {
                                                                    token = respuestaObject['access_token'];
                                                                    shell.token = token;

                                                                    $http.post('./sirius_route/updateShellsMzone', shell).then(function (responseUpdateShellsMzone) {
                                                                        console.log("RESPUESTA EN EL SERVICE [activarLocalizacion/updateShellsMzone]: " + JSON.stringify(responseUpdateShellsMzone));

                                                                        if (responseUpdateShellsMzone['status'] === 200 || responseUpdateShellsMzone['status'] === 204) {
                                                                            respuesta.error = false;
                                                                            respuesta.status = null;
                                                                            respuesta.message = "Activación correcta";
                                                                            respuesta.svcReqId = respuestaObject['svcReqId'];
                                                                            resolve(respuesta);

                                                                        } else {
                                                                            respuesta.error = true;
                                                                            respuesta.status = 2009;
                                                                            respuesta.message = "La activación fue exitosa, sin embargo, ocurrio un problema al actualizar el perfil en la API MZone/MProfile";
                                                                            respuesta.svcReqId = null;
                                                                            resolve(respuesta);
                                                                        }
                                                                    });

                                                                } else {
                                                                    respuesta.error = true;
                                                                    respuesta.status = 2008;
                                                                    respuesta.message = "La activación fue exitosa, sin embargo, hubo un problema con la consulta del TOKEN MZone\n" + respuestaObject['error_description'];
                                                                    respuesta.svcReqId = null;
                                                                    resolve(respuesta);
                                                                }

                                                            } else {
                                                                respuesta.error = true;
                                                                respuesta.status = 2007;
                                                                respuesta.message = "La activación fue exitosa, sin embargo, hubo un problema con la consulta del TOKEN MZone, para actualizar el perfil en la API MZone/MProfile";
                                                                respuesta.svcReqId = null;
                                                                resolve(respuesta);
                                                            }
                                                        } else {
                                                            respuesta.error = true;
                                                            respuesta.status = 2006;
                                                            respuesta.message = "La activación fue exitosa, sin embargo, hubo un problema con la consulta del TOKEN MZone, para actualizar el perfil en la API MZone/MProfile";
                                                            respuesta.svcReqId = null;
                                                            resolve(respuesta);
                                                        }
                                                    });


                                                } else {
                                                    respuesta.error = true;
                                                    respuesta.status = 2005;
                                                    respuesta.message = "La activación fue exitosa, sin embargo, No se pudo actualizar el perfil MZone/MProfile con ID [" + shell.id + "]";
                                                    respuesta.svcReqId = null;
                                                    resolve(respuesta);
                                                }
                                            });
                                        } else {
                                            respuesta.error = true;
                                            respuesta.status = 2004;
                                            respuesta.message = "La activación fue exitosa, sin embargo, No se encontro un perfil MZone/MProfile libre para el envio de posiciones";
                                            respuesta.svcReqId = null;
                                            resolve(respuesta);
                                        }


                                    } else {
                                        respuesta.error = true;
                                        respuesta.status = 2003;
                                        respuesta.message = "La activación fue exitosa, sin embargo, No se encontro un perfil MZone/MProfile libre para el envio de posiciones";
                                        respuesta.svcReqId = null;
                                        resolve(respuesta);
                                    }
                                });

                            } else {
                                respuesta.error = true;
                                respuesta.status = 2002;
                                respuesta.message = "La activación fue exitosa, sinembargo, Ocurrio un problema al registrar el TRACKER en la base de datos";
                                respuesta.svcReqId = null;
                                resolve(respuesta);
                            }
                        });


                    } else {
                        respuesta.error = true;
                        respuesta.status = 2001;
                        respuesta.message = "No se recibio la respuesta con el valor svcReqId";
                        respuesta.svcReqId = null;
                        resolve(respuesta);
                    }

                } else {
                    respuesta.error = true;
                    respuesta.status = response['status'];
                    respuesta.message = response['message'];
                    respuesta.svcReqId = null;
                    resolve(respuesta);
                }
            });
        });
    };

    this.cancelarLocalizacion = function (vinRequest) {

        return new Promise((resolve, reject) => {
            var respuesta = new Object();

            $http.post('./sirius_route/cancelarLocalizacion', vinRequest).then(function (response) {
                console.log("RESPUESTA EN EL SERVICE [cancelarLocalizacion]: " + JSON.stringify(response));


                if (response['status'] === 200) {
                    var respuestaCancelarLocalizacion = response['data'];

                    if (Object.entries(respuestaCancelarLocalizacion).length === 0) {
                        respuesta.error = true;
                        respuesta.status = 3001;
                        respuesta.message = "La localización no se encuentra activa, no se puede aplicar la canleación.";
                        respuesta.tracker = null;
                        resolve(respuesta);
                    } else {
                        if (respuestaCancelarLocalizacion['svcReqId'] !== null && respuestaCancelarLocalizacion['svcReqId'] !== '' && typeof (respuestaCancelarLocalizacion['svcReqId']) !== 'undefined') {

                            $http.post('./sirius_repository/deleteTracker', vinRequest).then(function (response) {
                                console.log("RESPUESTA EN EL SERVICE [cancelarLocalizacion/deleteTracker]: " + JSON.stringify(response));

                                if (response['status'] === 200) {

                                    $http.post('./sirius_repository/getShellByVIN', vinRequest).then(function (response) {
                                        console.log("RESPUESTA EN EL SERVICE [cancelarLocalizacion/getShellByVIN]: " + JSON.stringify(response));

                                        if (response['status'] === 200) {
                                            var respuestaGetShellTarcker = response['data'];
                                            console.log("RESPUESTA EN EL SERVICE [cancelarLocalizacion/getShellByVIN]: " + JSON.stringify(respuestaGetShellTarcker));

                                            if (respuestaGetShellTarcker['shell'] !== null && respuestaGetShellTarcker['shell'].length > 0) {
                                                var shell = respuestaGetShellTarcker['shell'][0];
                                                console.log("RESPUESTA EN EL SERVICE [cancelarLocalizacion/SHELL]: " + JSON.stringify(shell));

                                                shell.description = shell.id + " LIBRE";
                                                shell.registration = shell.id + " LIBRE";
                                                shell.vin = shell.id + " LIBRE";
                                                shell.isFavorite = false;
                                                shell.status = false;
                                                shell.lastUpdate = moment().format('YYYY/MM/DD HH:mm:ss');

                                                $http.post('./sirius_repository/updateShell', shell).then(function (response) {
                                                    console.log("RESPUESTA EN EL SERVICE [cancelarLocalizacion/updateShell]: " + JSON.stringify(response));


                                                    if (response['status'] === 200) {
                                                        var respuestaUpdateShell = response['data'];
                                                        console.log("RESPUESTA EN EL SERVICE [cancelarLocalizacion/updateShell]: " + JSON.stringify(respuestaUpdateShell));

                                                        $http.get('./sirius_route/getTokenMzone').then(function (response) {
                                                            console.log("RESPUESTA EN EL SERVICE [getTokenMzone]: " + JSON.stringify(response));


                                                            if (response['status'] === 200) {
                                                                var respuestaObject = response['data'];

                                                                if (respuestaObject !== null) {

                                                                    if (respuestaObject['access_token'] !== null && respuestaObject['access_token'] !== '' && typeof (respuestaObject['access_token']) !== 'undefined') {
                                                                        var token = respuestaObject['access_token'];
                                                                        shell.token = token;

                                                                        $http.post('./sirius_route/updateShellsMzone', shell).then(function (responseUpdateShellsMzone) {
                                                                            console.log("RESPUESTA EN EL SERVICE [cancelarLocalizacion/updateShellsMzone]: " + JSON.stringify(responseUpdateShellsMzone));

                                                                            if (responseUpdateShellsMzone['status'] === 200 || responseUpdateShellsMzone['status'] === 204) {
                                                                                respuesta.error = false;
                                                                                respuesta.status = null;
                                                                                respuesta.message = "Cancelación correcta";
                                                                                respuesta.svcReqId = respuestaObject['svcReqId'];
                                                                                resolve(respuesta);

                                                                            } else {
                                                                                respuesta.error = true;
                                                                                respuesta.status = 3009;
                                                                                respuesta.message = "La cancelación fue exitosa, sin embargo, ocurrio un problema al actualizar el perfil en la API MZone/MProfile";
                                                                                respuesta.svcReqId = null;
                                                                                resolve(respuesta);
                                                                            }
                                                                        });

                                                                    } else {
                                                                        respuesta.error = true;
                                                                        respuesta.status = 3008;
                                                                        respuesta.message = "La cancelación fue exitosa, sin embargo, hubo un problema con la consulta del TOKEN MZone\n" + respuestaObject['error_description'];
                                                                        respuesta.svcReqId = null;
                                                                        resolve(respuesta);
                                                                    }

                                                                } else {
                                                                    respuesta.error = true;
                                                                    respuesta.status = 3007;
                                                                    respuesta.message = "La cancelación fue exitosa, sin embargo, hubo un problema con la consulta del TOKEN MZone, para actualizar el perfil en la API MZone/MProfile";
                                                                    respuesta.svcReqId = null;
                                                                    resolve(respuesta);
                                                                }
                                                            } else {
                                                                respuesta.error = true;
                                                                respuesta.status = 3006;
                                                                respuesta.message = "La cancelación fue exitosa, sin embargo, hubo un problema con la consulta del TOKEN MZone, para actualizar el perfil en la API MZone/MProfile";
                                                                respuesta.svcReqId = null;
                                                                resolve(respuesta);
                                                            }
                                                        });


                                                    } else {
                                                        respuesta.error = true;
                                                        respuesta.status = 3005;
                                                        respuesta.message = "La cancelación fue exitosa, sin embargo, No se pudo actualizar en la base de datos el perfil MZone/MProfile con ID [" + shell.id + "] para poder ser liberado";
                                                        respuesta.svcReqId = null;
                                                        resolve(respuesta);
                                                    }
                                                });

                                            } else {
                                                respuesta.error = true;
                                                respuesta.status = 3004;
                                                respuesta.message = "La cancelación fue exitosa, sin embargo, No se encontro un perfil MZone/MProfile ocupado con el VIN " + vinRequest.vin + " para el envio de posiciones";
                                                respuesta.svcReqId = null;
                                                resolve(respuesta);
                                            }


                                        } else {
                                            respuesta.error = true;
                                            respuesta.status = 3003;
                                            respuesta.message = "La cancelación fue exitosa, sin embargo, No se encontro un perfil MZone/MProfile ocupado con el VIN " + vinRequest.vin + " para el envio de posiciones";
                                            respuesta.svcReqId = null;
                                            resolve(respuesta);
                                        }
                                    });

                                } else {
                                    respuesta.error = true;
                                    respuesta.status = 3002;
                                    respuesta.message = "La cancelación se realizo con exito, sin embargo ocurrio un problema al eliminar el TRACKER de la base de datos\n" + response['message'];
                                    respuesta.tracker = null;
                                    resolve(respuesta);
                                }
                            });


                        } else {
                            respuesta.error = true;
                            respuesta.status = respuestaCancelarLocalizacion['status'];
                            respuesta.message = respuestaCancelarLocalizacion['message'];
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

    this.bloquearLocalizacion = function (vinRequest) {

        return new Promise((resolve, reject) => {
            var respuesta = new Object();

            var idSession = "";
            $http.post('./sirius_repository/getTracker', vinRequest).then(function (response) {
                console.log("RESPUESTA EN EL SERVICE [bloquearLocalizacion/getTracker]: " + JSON.stringify(response));
                var responseObject = response['data'];
                console.log("RESPUESTA OBJECT [bloquearLocalizacion/getTracker]: " + JSON.stringify(responseObject));
                var trackerObject = responseObject['tracker'];
                console.log("RESPUESTA TRACKER [bloquearLocalizacion/getTracker]: " + JSON.stringify(trackerObject));
                vinRequest.sessionId = trackerObject[0]['session_id'];
                console.log("RESPUESTA SESSION ID [bloquearLocalizacion/getTracker]: " + JSON.stringify(vinRequest.sessionId));
                idSession = vinRequest.sessionId;
                console.log("RESPUESTA SESSION ID [bloquearLocalizacion/getTracker]: " + JSON.stringify(idSession));

                vinRequest.sessionId = idSession;
                console.log("+++RESPUESTA SESSION ID [bloquearLocalizacion/getTracker]: " + JSON.stringify(vinRequest.sessionId));

                $http.post('./sirius_route/bloquearLocalizacion', vinRequest).then(function (response) {
                    console.log("RESPUESTA EN EL SERVICE [bloquearLocalizacion]: " + JSON.stringify(response));

                    var respuestaObject;
                    if (response['status'] === 200) {
                        respuestaObject = response['data'];

                        if (Object.entries(respuestaObject).length === 0) {
                            respuesta.error = true;
                            respuesta.status = 1005;
                            respuesta.message = "La localización no se encuentra activa, no se puede aplicar el bloqueo.";
                            respuesta.tracker = null;
                            resolve(respuesta);
                        } else {
                            if (respuestaObject['svcReqId'] !== null && respuestaObject['svcReqId'] !== '' && typeof (respuestaObject['svcReqId']) !== 'undefined') {

                                vinRequest.svcReqId = respuestaObject['svcReqId'];
                                vinRequest.eventType = "BLOCK_TRACKER";
                                $http.post('./sirius_repository/saveTracker', vinRequest).then(function (response) {
                                    console.log("RESPUESTA EN EL SERVICE [bloquearLocalizacion/saveTracker]: " + JSON.stringify(response));
                                });

                                respuesta.error = false;
                                respuesta.status = null;
                                respuesta.message = "El bloqueo de la localización se realizo con exito.";
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
        });
    };

    this.aplazarLocalizacion = function (vinRequest) {

        return new Promise((resolve, reject) => {
            var respuesta = new Object();

            $http.post('./sirius_repository/getTracker', vinRequest).then(function (response) {
                console.log("RESPUESTA EN EL SERVICE [aplazarLocalizacion/getTracker]: " + JSON.stringify(response));
                var responseObject = response['data'];
                console.log("RESPUESTA OBJECT [aplazarLocalizacion/getTracker]: " + JSON.stringify(responseObject));
                var trackerObject = responseObject['tracker'];
                console.log("RESPUESTA TRACKER [aplazarLocalizacion/getTracker]: " + JSON.stringify(trackerObject));
                vinRequest.svcReqId = trackerObject[0]['svc_req_id'];
                console.log("RESPUESTA SVC REQ ID [aplazarLocalizacion/getTracker]: " + JSON.stringify(vinRequest.svcReqId));
            });

            $http.post('./sirius_route/aplazarLocalizacion', vinRequest).then(function (response) {
                console.log("RESPUESTA EN EL SERVICE [aplazarLocalizacion]: " + JSON.stringify(response));

                var respuestaObject;
                if (response['status'] === 200) {
                    respuestaObject = response['data'];

                    if (Object.entries(respuestaObject).length === 0) {
                        respuesta.error = true;
                        respuesta.status = 1005;
                        respuesta.message = "La localización no se encuentra activa, no se puede aplicar el aplazamiento.";
                        respuesta.tracker = null;
                        resolve(respuesta);
                    } else {
                        if (respuestaObject['svcReqId'] !== null && respuestaObject['svcReqId'] !== '' && typeof (respuestaObject['svcReqId']) !== 'undefined') {

                            vinRequest.svcReqId = respuestaObject['svcReqId'];
                            vinRequest.eventType = "POSTPONE_TRACKER";
                            $http.post('./sirius_repository/saveTracker', vinRequest).then(function (response) {
                                console.log("RESPUESTA EN EL SERVICE [aplazarLocalizacion/saveTracker]: " + JSON.stringify(response));
                            });

                            respuesta.error = false;
                            respuesta.status = null;
                            respuesta.message = "El aplazamiento de la localización se realizo con exito.";
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

    this.actualizarShell = function (vinRequest) {

        return new Promise((resolve, reject) => {
            var respuesta = new Object();

            $http.post('./sirius_repository/getShellByVIN', vinRequest).then(function (response) {
                console.log("RESPUESTA EN EL SERVICE [actualizarShell/getShellByVIN]: " + JSON.stringify(response));

                if (response['status'] === 200) {
                    var respuestaGetShellTarcker = response['data'];
                    console.log("RESPUESTA EN EL SERVICE [actualizarShell/getShellByVIN]: " + JSON.stringify(respuestaGetShellTarcker));

                    if (respuestaGetShellTarcker['shell'] !== null && respuestaGetShellTarcker['shell'].length > 0) {
                        var shell = respuestaGetShellTarcker['shell'][0];
                        console.log("RESPUESTA EN EL SERVICE [actualizarShell/SHELL]: " + JSON.stringify(shell));

                        shell.description = shell.id + " LIBRE";
                        shell.registration = shell.id + " LIBRE";
                        shell.vin = shell.id + " LIBRE";
                        shell.isFavorite = false;
                        shell.status = false;
                        shell.lastUpdate = moment().format('YYYY/MM/DD HH:mm:ss');

                        $http.post('./sirius_repository/updateShell', shell).then(function (response) {
                            console.log("RESPUESTA EN EL SERVICE [actualizarShell/updateShell]: " + JSON.stringify(response));


                            if (response['status'] === 200) {
                                var respuestaUpdateShell = response['data'];
                                console.log("RESPUESTA EN EL SERVICE [actualizarShell/updateShell]: " + JSON.stringify(respuestaUpdateShell));

                                $http.get('./sirius_route/getTokenMzone').then(function (response) {
                                    console.log("RESPUESTA EN EL SERVICE [getTokenMzone]: " + JSON.stringify(response));


                                    if (response['status'] === 200) {
                                        var respuestaObject = response['data'];

                                        if (respuestaObject !== null) {

                                            if (respuestaObject['access_token'] !== null && respuestaObject['access_token'] !== '' && typeof (respuestaObject['access_token']) !== 'undefined') {
                                                var token = respuestaObject['access_token'];
                                                shell.token = token;

                                                $http.post('./sirius_route/updateShellsMzone', shell).then(function (responseUpdateShellsMzone) {
                                                    console.log("RESPUESTA EN EL SERVICE [actualizarShell/updateShellsMzone]: " + JSON.stringify(responseUpdateShellsMzone));

                                                    if (responseUpdateShellsMzone['status'] === 200 || responseUpdateShellsMzone['status'] === 204) {
                                                        respuesta.error = false;
                                                        respuesta.status = null;
                                                        respuesta.message = "Actualización correcta";
                                                        respuesta.svcReqId = respuestaObject['svcReqId'];
                                                        resolve(respuesta);

                                                    } else {
                                                        respuesta.error = true;
                                                        respuesta.status = 3009;
                                                        respuesta.message = "Ocurrio un problema al actualizar el perfil en la API MZone/MProfile";
                                                        respuesta.svcReqId = null;
                                                        resolve(respuesta);
                                                    }
                                                });

                                            } else {
                                                respuesta.error = true;
                                                respuesta.status = 3008;
                                                respuesta.message = "Hubo un problema con la consulta del TOKEN MZone\n" + respuestaObject['error_description'];
                                                respuesta.svcReqId = null;
                                                resolve(respuesta);
                                            }

                                        } else {
                                            respuesta.error = true;
                                            respuesta.status = 3007;
                                            respuesta.message = "Hubo un problema con la consulta del TOKEN MZone, para actualizar el perfil en la API MZone/MProfile";
                                            respuesta.svcReqId = null;
                                            resolve(respuesta);
                                        }
                                    } else {
                                        respuesta.error = true;
                                        respuesta.status = 3006;
                                        respuesta.message = "Hubo un problema con la consulta del TOKEN MZone, para actualizar el perfil en la API MZone/MProfile";
                                        respuesta.svcReqId = null;
                                        resolve(respuesta);
                                    }
                                });


                            } else {
                                respuesta.error = true;
                                respuesta.status = 3005;
                                respuesta.message = "No se pudo actualizar en la base de datos el perfil MZone/MProfile con ID [" + shell.id + "] para poder ser liberado";
                                respuesta.svcReqId = null;
                                resolve(respuesta);
                            }
                        });

                    } else {
                        respuesta.error = true;
                        respuesta.status = 3004;
                        respuesta.message = "No se encontro un perfil MZone/MProfile ocupado con el VIN " + vinRequest.vin + " para el envio de posiciones";
                        respuesta.svcReqId = null;
                        resolve(respuesta);
                    }


                } else {
                    respuesta.error = true;
                    respuesta.status = 3003;
                    respuesta.message = "No se encontro un perfil MZone/MProfile ocupado con el VIN " + vinRequest.vin + " para el envio de posiciones";
                    respuesta.svcReqId = null;
                    resolve(respuesta);
                }
            });


        });
    };
});

