var app = angular.module('ccportal');

app.service('SiriusService', function($http) {

    this.consultaTenans = function() {
        return new Promise((resolve, reject) => {

            var respuesta = new Object();

            $http.get('./sirius_repository/getTenans').then(function(response) {
                console.log("RESPUESTA EN EL SERVICE [consultaTenans]: " + JSON.stringify(response));

                var respuestaObject;

                if (response['status'] === 200) {
                    respuestaObject = response['data'];

                    console.log("TENANS: " + JSON.stringify(respuestaObject));
                    respuesta.error = false;
                    respuesta.status = 'OK';
                    respuesta.message = 'Consulta de tenans o tipos de clientes con exito.';
                    respuesta.tenans = respuestaObject['tenans'];

                    resolve(respuesta);
                } else {
                    respuesta.error = true;
                    respuesta.status = 'Error';
                    respuesta.message = 'No hay tenans o tipos de clientes configurados.';
                    respuesta.tenans = null;
                    resolve(respuesta);
                }
            });
        });
    };

    this.consultarVehiculosSinBloqueo = function(vehiculos_sin_bloqueo) {

        console.log("VEHICULO_SIN_BLOQUEO EN EL SERVICE: " + JSON.stringify(vehiculos_sin_bloqueo));

        return new Promise((resolve, reject) => {

            var respuesta = new Object();

            $http.post('./sirius_repository/getVehiculosSinBloqueo', vehiculos_sin_bloqueo).then(function(response) {
                console.log("RESPUESTA EN EL SERVICE [getVehiculosSinBloqueo]: " + JSON.stringify(response));

                var respuestaObject;

                if (response['status'] === 200) {
                    respuestaObject = response['data'];

                    console.log("VEHICULO_SIN_BLOQUEO: " + JSON.stringify(respuestaObject));
                    respuesta.error = false;
                    respuesta.status = 'OK';
                    respuesta.message = 'Consulta de vehiculos sin bloqueo con exito.';
                    respuesta.vehiculos_sin_bloqueo = respuestaObject['vehiculos_sin_bloqueo'];

                    resolve(respuesta);
                } else {
                    respuesta.error = true;
                    respuesta.status = 'Error';
                    respuesta.message = 'No hay tenans o tipos de clientes configurados.';
                    respuesta.vehiculos_sin_bloqueo = null;
                    resolve(respuesta);
                }
            });
        });
    };

    this.consultaTokenSXMCloud = function(tenan) {
        console.log("TENAND_ID EN EL SERVICE: " + tenan.tenan_id);

        return new Promise((resolve, reject) => {
            var respuesta = new Object();
            $http.post('./sirius_route/SXM-Cloud', tenan).then(function(response) {
                console.log("RESPUESTA EN EL SERVICE [consultaTokenSXMCloud]: " + JSON.stringify(response));

                var respuestaObject;
                var token;

                if (response['status'] === 200) {
                    respuestaObject = response['data'];

                    if (respuestaObject !== null) {

                        if (respuestaObject['access_token'] !== null && respuestaObject['access_token'] !== '' && typeof(respuestaObject['access_token']) !== 'undefined') {
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

    this.consultaCliente = function(cliente) {

        return new Promise((resolve, reject) => {
            var respuesta = new Object();
            $http.post('./sirius_route/consultarCliente', cliente).then(function(response) {
                console.log("RESPUESTA EN EL SERVICE [consultaCliente]: " + JSON.stringify(response));

                var respuestaObject;
                var listaClientes = [];
                if (response['status'] === 200) {
                    respuestaObject = response['data'].result;

                    if (respuestaObject !== null) {

                        if (Array.isArray(response['data'].result)) {

                            listaClientes = response['data'].result;
                            if (typeof(listaClientes) !== 'undefined' && listaClientes !== null && listaClientes.length !== null && listaClientes.length > 0) {

                                listaClientes.forEach(function(valor, indice, array) {
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

    this.consultarDetalleVehiculo = function(vehiculo) {

        return new Promise((resolve, reject) => {
            var respuesta = new Object();
            $http.post('./sirius_route/consultarDetalleVehiculo', vehiculo).then(function(response) {
                console.log("RESPUESTA EN EL SERVICE [consultarDetalleVehiculo]: " + JSON.stringify(response));

                var respuestaObject;
                if (response['status'] === 200) {
                    respuestaObject = response['data'];
                    console.log("VEHICULO EN EL SERVICE: " + JSON.stringify(respuestaObject));

                    if (respuestaObject !== null) {
                        respuesta.error = false;
                        respuesta.status = 200;
                        respuesta.message = "Consulta de dedatlle del vehiculo correcta";
                        respuesta.detalle_vehiculo = respuestaObject;
                        resolve(respuesta);

                    } else {
                        respuesta.error = true;
                        respuesta.status = response['status'];
                        respuesta.message = response['message'];
                        respuesta.detalle_vehiculo = null;
                        resolve(respuesta);
                    }
                } else {
                    respuesta.error = true;
                    respuesta.status = response['status'];
                    respuesta.message = response['message'];
                    respuesta.detalle_vehiculo = null;
                    resolve(respuesta);
                }
            });
        });
    };

    this.consultaEstatusLocalizacion = function(request) {

        return new Promise((resolve, reject) => {
            var respuesta = new Object();
            $http.post('./sirius_route/estatusLocalizacion', request).then(function(response) {
                console.log("RESPUESTA EN EL SERVICE [consultaEstatusLocalizacion]: " + JSON.stringify(response));

                var respuestaObject;
                var tracker;

                if (response['status'] === 200) {
                    respuestaObject = response['data'];

                    if (respuestaObject !== null && respuestaObject !== "" && typeof(respuestaObject) !== "") {

                        if (Object.entries(respuestaObject).length === 0) {
                            respuesta.error = false;
                            respuesta.status = 1005;
                            respuesta.message = "El vehículo con el VIN: " + request.vin + " NO tiene una localización activa.";
                            respuesta.tracker = respuestaObject;
                            resolve(respuesta);
                        } else {

                            if (respuestaObject['tracker'] !== null && respuestaObject['tracker'] !== '' && typeof(respuestaObject['tracker']) !== 'undefined') {
                                tracker = respuestaObject['tracker'];

                                if (tracker['status'] === "ACTIVE") {
                                    respuesta.error = true;
                                    respuesta.status = 1006;
                                    respuesta.message = "La localización para el vehículo con el VIN " + request.vin + " ya se encuentra activa. ";
                                    respuesta.tracker = tracker;
                                    resolve(respuesta);
                                } else if (tracker['status'] === "FAILED") {
                                    respuesta.error = true;
                                    respuesta.status = 1007;
                                    respuesta.message = "La localización para el vehículo con el VIN " + request.vin + " tiene un estatus: " + tracker['status'] + ".";
                                    respuesta.tracker = tracker;
                                    resolve(respuesta);
                                } else if (tracker['status'] === "ACTIVATION_IN_PROGRESS") {
                                    respuesta.error = true;
                                    respuesta.status = 1009;
                                    respuesta.message = "La localización para el vehículo con el VIN " + request.vin + " tiene un estatus: " + tracker['status'] + ".";
                                    respuesta.tracker = tracker;
                                    resolve(respuesta);
                                } else if (tracker['status'] === "CANCELLATION_IN_PROGRESS") {
                                    respuesta.error = true;
                                    respuesta.status = 1010;
                                    respuesta.message = "La localización para el vehículo con el VIN " + request.vin + " tiene un estatus: " + tracker['status'] + ".";
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
                            respuesta.message = "No se encontro información sobre el Tracker para el VIN: " + request.vin + ".";
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

    this.activarLocalizacion = function(request) {

        console.log("VIN-REQUEST EN EL SERVICE: " + JSON.stringify(request));

        return new Promise((resolve, reject) => {
            var respuesta = new Object();
            $http.post('./sirius_route/activarLocalizacion', request).then(function(response) {
                console.log("RESPUESTA EN EL SERVICE [activarLocalizacion]: " + JSON.stringify(response));


                if (response['status'] === 200) {
                    var respuestaObject = response['data'];

                    if (respuestaObject['svcReqId'] !== null && respuestaObject['svcReqId'] !== '' && typeof(respuestaObject['svcReqId']) !== 'undefined') {

                        request.svcReqId = respuestaObject['svcReqId'];
                        request.eventType = "ACTIVE_TRACKER";

                        $http.post('./sirius_repository/saveTracker', request).then(function(response) {
                            console.log("RESPUESTA EN EL SERVICE [activarLocalizacion/saveTracker]: " + JSON.stringify(response));


                            if (response['status'] === 200) {
                                var respuestaSaveTarcker = response['data'];
                                console.log("RESPUESTA EN EL SERVICE [activarLocalizacion/saveTracker]: " + JSON.stringify(respuestaSaveTarcker));

                                $http.post('./sirius_repository/getShellByStatus', request).then(function(response) {
                                    console.log("RESPUESTA EN EL SERVICE [activarLocalizacion/getShellByStatus]: " + JSON.stringify(response));


                                    if (response['status'] === 200) {
                                        var respuestaGetShellTarcker = response['data'];
                                        console.log("RESPUESTA EN EL SERVICE [activarLocalizacion/getShellByStatus]: " + JSON.stringify(respuestaGetShellTarcker));

                                        if (respuestaGetShellTarcker['shell'] !== null && respuestaGetShellTarcker['shell'].length > 0) {
                                            var shell = respuestaGetShellTarcker['shell'][0];
                                            console.log("RESPUESTA EN EL SERVICE [activarLocalizacion/SHELL]: " + JSON.stringify(shell));

                                            shell.description = request.vin;
                                            shell.registration = request.vin;
                                            shell.vin = request.vin;
                                            shell.isFavorite = true;
                                            shell.status = true;
                                            shell.lastUpdate = moment().format('YYYY/MM/DD HH:mm:ss');

                                            $http.post('./sirius_repository/updateShell', shell).then(function(response) {
                                                console.log("RESPUESTA EN EL SERVICE [activarLocalizacion/updateShell]: " + JSON.stringify(response));


                                                if (response['status'] === 200) {
                                                    var respuestaUpdateShell = response['data'];
                                                    console.log("RESPUESTA EN EL SERVICE [activarLocalizacion/updateShell]: " + JSON.stringify(respuestaUpdateShell));

                                                    respuesta.error = false;
                                                    respuesta.status = null;
                                                    respuesta.message = "Activación correcta";
                                                    respuesta.svcReqId = respuestaObject['svcReqId'];
                                                    resolve(respuesta);

                                                    $http.get('./sirius_route/getTokenMzone').then(function(responseTokenMzone) {
                                                        console.log("RESPUESTA EN EL SERVICE [getTokenMzone]: " + JSON.stringify(responseTokenMzone));

                                                        var respuestaObject;
                                                        var token;

                                                        if (responseTokenMzone['status'] === 200) {
                                                            respuestaObject = responseTokenMzone['data'];

                                                            if (respuestaObject !== null) {

                                                                if (respuestaObject['access_token'] !== null && respuestaObject['access_token'] !== '' && typeof(respuestaObject['access_token']) !== 'undefined') {
                                                                    token = respuestaObject['access_token'];
                                                                    shell.token = token;

                                                                    $http.post('./sirius_route/updateShellsMzone', shell).then(function(responseUpdateShellsMzone) {
                                                                        console.log("RESPUESTA EN EL SERVICE [activarLocalizacion/updateShellsMzone]: " + JSON.stringify(responseUpdateShellsMzone));

                                                                        if (responseUpdateShellsMzone['status'] === 200 || responseUpdateShellsMzone['status'] === 204) {
                                                                            respuesta.error = false;
                                                                            respuesta.status = null;
                                                                            respuesta.message = "Activación correcta";
                                                                            respuesta.svcReqId = respuestaObject['svcReqId'];
                                                                            resolve(respuesta);



                                                                            //Segunda llamada para actualizar el perfil en MZone/MProfile
                                                                            $http.get('./sirius_route/getTokenMzoneHija').then(function(responseTokenMzone) {
                                                                                console.log("RESPUESTA EN EL SERVICE [getTokenMzoneHija]: " + JSON.stringify(responseTokenMzone));

                                                                                var respuestaObject;
                                                                                var token;

                                                                                if (responseTokenMzone['status'] === 200) {
                                                                                    respuestaObject = responseTokenMzone['data'];

                                                                                    if (respuestaObject !== null) {

                                                                                        if (respuestaObject['access_token'] !== null && respuestaObject['access_token'] !== '' && typeof(respuestaObject['access_token']) !== 'undefined') {
                                                                                            token = respuestaObject['access_token'];
                                                                                            shell.token = token;

                                                                                            $http.post('./sirius_route/updateShellsMzone', shell).then(function(responseUpdateShellsMzone) {
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
                                respuesta.message = "La activación fue exitosa, sin embargo, Ocurrio un problema al registrar el TRACKER en la base de datos";
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

    this.cancelarLocalizacion = function(request) {

        return new Promise((resolve, reject) => {
            var respuesta = new Object();

            $http.post('./sirius_route/cancelarLocalizacion', request).then(function(response) {
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
                        if (respuestaCancelarLocalizacion['svcReqId'] !== null && respuestaCancelarLocalizacion['svcReqId'] !== '' && typeof(respuestaCancelarLocalizacion['svcReqId']) !== 'undefined') {

                            $http.post('./sirius_repository/deleteTracker', request).then(function(response) {
                                console.log("RESPUESTA EN EL SERVICE [cancelarLocalizacion/deleteTracker]: " + JSON.stringify(response));

                                if (response['status'] === 200) {

                                    $http.post('./sirius_repository/getShellByVIN', request).then(function(response) {
                                        console.log("RESPUESTA EN EL SERVICE [cancelarLocalizacion/getShellByVIN]: " + JSON.stringify(response));

                                        if (response['status'] === 200) {
                                            var respuestaGetShellTarcker = response['data'];
                                            console.log("RESPUESTA EN EL SERVICE [cancelarLocalizacion/getShellByVIN]: " + JSON.stringify(respuestaGetShellTarcker));

                                            if (respuestaGetShellTarcker['shell'] !== null && respuestaGetShellTarcker['shell'].length > 0) {
                                                var shell = respuestaGetShellTarcker['shell'][0];
                                                console.log("RESPUESTA EN EL SERVICE [cancelarLocalizacion/SHELL]: " + JSON.stringify(shell));

                                                shell.description = shell.id + ' LIBRE';
                                                shell.registration = shell.id + ' LIBRE';
                                                shell.vin = shell.id + ' LIBRE';
                                                shell.isFavorite = false;
                                                shell.status = false;
                                                shell.lastUpdate = moment().format('YYYY/MM/DD HH:mm:ss');

                                                $http.post('./sirius_repository/updateShell', shell).then(function(response) {
                                                    console.log("RESPUESTA EN EL SERVICE [cancelarLocalizacion/updateShell]: " + JSON.stringify(response));


                                                    if (response['status'] === 200) {
                                                        var respuestaUpdateShell = response['data'];
                                                        console.log("RESPUESTA EN EL SERVICE [cancelarLocalizacion/updateShell]: " + JSON.stringify(respuestaUpdateShell));

                                                        $http.get('./sirius_route/getTokenMzone').then(function(response) {
                                                            console.log("RESPUESTA EN EL SERVICE [getTokenMzone]: " + JSON.stringify(response));


                                                            if (response['status'] === 200) {
                                                                var respuestaObject = response['data'];

                                                                if (respuestaObject !== null) {

                                                                    if (respuestaObject['access_token'] !== null && respuestaObject['access_token'] !== '' && typeof(respuestaObject['access_token']) !== 'undefined') {
                                                                        var token = respuestaObject['access_token'];
                                                                        shell.token = token;

                                                                        $http.post('./sirius_route/updateShellsMzone', shell).then(function(responseUpdateShellsMzone) {
                                                                            console.log("RESPUESTA EN EL SERVICE [cancelarLocalizacion/updateShellsMzone]: " + JSON.stringify(responseUpdateShellsMzone));

                                                                            if (responseUpdateShellsMzone['status'] === 200 || responseUpdateShellsMzone['status'] === 204) {
                                                                                respuesta.error = false;
                                                                                respuesta.status = null;
                                                                                respuesta.message = "La cancelación del traking para el vehiculo con el VIN " + request.vin + " fue exitosa";
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
                                                respuesta.message = "La cancelación fue exitosa, sin embargo, No se encontro un perfil MZone/MProfile ocupado con el VIN " + request.vin + ".";
                                                respuesta.svcReqId = null;
                                                resolve(respuesta);
                                            }


                                        } else {
                                            respuesta.error = true;
                                            respuesta.status = 3003;
                                            respuesta.message = "La cancelación fue exitosa, sin embargo, No se encontro un perfil MZone/MProfile ocupado con el VIN " + request.vin + " para el envio de posiciones";
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

    this.bloquearLocalizacion = function(request) {

        return new Promise((resolve, reject) => {
            var respuesta = new Object();

            var idSession = "";
            var idCorrelation = "";
            $http.post('./sirius_repository/getTracker', request).then(function(response) {
                console.log("RESPUESTA EN EL SERVICE [bloquearLocalizacion/getTracker]: " + JSON.stringify(response));
                var responseObject = response['data'];
                console.log("RESPUESTA OBJECT [bloquearLocalizacion/getTracker]: " + JSON.stringify(responseObject));
                var trackerObject = responseObject['tracker'];
                console.log("RESPUESTA TRACKER [bloquearLocalizacion/getTracker]: " + JSON.stringify(trackerObject));

                request.sessionId = trackerObject[0]['session_id'];
                console.log("RESPUESTA SESSION ID [bloquearLocalizacion/getTracker]: " + JSON.stringify(request.sessionId));
                idSession = request.sessionId;
                console.log("RESPUESTA SESSION ID [bloquearLocalizacion/getTracker]: " + JSON.stringify(idSession));

                request.correlationId = trackerObject[0]['correlation_id'];
                console.log("RESPUESTA CORRELATION ID [bloquearLocalizacion/getTracker]: " + JSON.stringify(request.correlationId));
                idCorrelation = request.correlationId;
                console.log("RESPUESTA CORRELATION ID [bloquearLocalizacion/getTracker]: " + JSON.stringify(idCorrelation));

                request.sessionId = idSession;
                request.correlationId = idCorrelation;
                console.log("+++RESPUESTA SESSION ID [bloquearLocalizacion/getTracker]: " + JSON.stringify(request.sessionId));
                console.log("+++RESPUESTA CORRELATION ID [bloquearLocalizacion/getTracker]: " + JSON.stringify(request.correlationId));

                $http.post('./sirius_route/bloquearLocalizacion', request).then(function(response) {
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
                            if (respuestaObject['svcReqId'] !== null && respuestaObject['svcReqId'] !== '' && typeof(respuestaObject['svcReqId']) !== 'undefined') {

                                request.svcReqId = respuestaObject['svcReqId'];
                                request.eventType = "BLOCK_TRACKER";
                                $http.post('./sirius_repository/saveTracker', request).then(function(response) {
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

    this.aplazarLocalizacion = function(request) {

        return new Promise((resolve, reject) => {
            var respuesta = new Object();

            $http.post('./sirius_repository/getTracker', request).then(function(response) {
                console.log("RESPUESTA EN EL SERVICE [aplazarLocalizacion/getTracker]: " + JSON.stringify(response));
                var responseObject = response['data'];
                console.log("RESPUESTA OBJECT [aplazarLocalizacion/getTracker]: " + JSON.stringify(responseObject));
                var trackerObject = responseObject['tracker'];
                console.log("RESPUESTA TRACKER [aplazarLocalizacion/getTracker]: " + JSON.stringify(trackerObject));
                request.svcReqId = trackerObject[0]['svc_req_id'];
                console.log("RESPUESTA SVC REQ ID [aplazarLocalizacion/getTracker]: " + JSON.stringify(request.svcReqId));
            });

            $http.post('./sirius_route/aplazarLocalizacion', request).then(function(response) {
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
                        if (respuestaObject['svcReqId'] !== null && respuestaObject['svcReqId'] !== '' && typeof(respuestaObject['svcReqId']) !== 'undefined') {

                            request.svcReqId = respuestaObject['svcReqId'];
                            request.eventType = "POSTPONE_TRACKER";
                            $http.post('./sirius_repository/saveTracker', request).then(function(response) {
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

    this.actualizarShell = function(vinRequest) {

        return new Promise((resolve, reject) => {
            var respuesta = new Object();

            $http.post('./sirius_repository/getShellByVIN', vinRequest).then(function(response) {
                console.log("RESPUESTA EN EL SERVICE [actualizarShell/getShellByVIN]: " + JSON.stringify(response));

                if (response['status'] === 200) {
                    var respuestaGetShellTarcker = response['data'];
                    console.log("RESPUESTA EN EL SERVICE [actualizarShell/getShellByVIN]: " + JSON.stringify(respuestaGetShellTarcker));

                    if (respuestaGetShellTarcker['shell'] !== null && respuestaGetShellTarcker['shell'].length > 0) {
                        var shell = respuestaGetShellTarcker['shell'][0];
                        console.log("RESPUESTA EN EL SERVICE [actualizarShell/SHELL]: " + JSON.stringify(shell));

                        shell.description = shell.id + ' LIBRE';
                        shell.registration = shell.id + ' LIBRE';
                        shell.vin = shell.id + ' LIBRE';
                        shell.isFavorite = false;
                        shell.status = false;
                        shell.lastUpdate = moment().format('YYYY/MM/DD HH:mm:ss');

                        $http.post('./sirius_repository/updateShell', shell).then(function(response) {
                            console.log("RESPUESTA EN EL SERVICE [actualizarShell/updateShell]: " + JSON.stringify(response));


                            if (response['status'] === 200) {
                                var respuestaUpdateShell = response['data'];
                                console.log("RESPUESTA EN EL SERVICE [actualizarShell/updateShell]: " + JSON.stringify(respuestaUpdateShell));

                                $http.get('./sirius_route/getTokenMzone').then(function(response) {
                                    console.log("RESPUESTA EN EL SERVICE [getTokenMzone]: " + JSON.stringify(response));


                                    if (response['status'] === 200) {
                                        var respuestaObject = response['data'];

                                        if (respuestaObject !== null) {

                                            if (respuestaObject['access_token'] !== null && respuestaObject['access_token'] !== '' && typeof(respuestaObject['access_token']) !== 'undefined') {
                                                var token = respuestaObject['access_token'];
                                                shell.token = token;

                                                $http.post('./sirius_route/updateShellsMzone', shell).then(function(responseUpdateShellsMzone) {
                                                    console.log("RESPUESTA EN EL SERVICE [actualizarShell/updateShellsMzone]: " + JSON.stringify(responseUpdateShellsMzone));

                                                    if (responseUpdateShellsMzone['status'] === 200 || responseUpdateShellsMzone['status'] === 204) {
                                                        respuesta.error = false;
                                                        respuesta.status = null;
                                                        respuesta.message = "Actualización correcta";
                                                        respuesta.svcReqId = respuestaObject['svcReqId'];
                                                        resolve(respuesta);


                                                        //Segunda llamada para actualizar el perfil en MZone/MProfile
                                                        $http.get('./sirius_route/getTokenMzoneHija').then(function(response) {
                                                            console.log("RESPUESTA EN EL SERVICE [getTokenMzoneHija]: " + JSON.stringify(response));


                                                            if (response['status'] === 200) {
                                                                var respuestaObject = response['data'];

                                                                if (respuestaObject !== null) {

                                                                    if (respuestaObject['access_token'] !== null && respuestaObject['access_token'] !== '' && typeof(respuestaObject['access_token']) !== 'undefined') {
                                                                        var token = respuestaObject['access_token'];
                                                                        shell.token = token;

                                                                        $http.post('./sirius_route/updateShellsMzone', shell).then(function(responseUpdateShellsMzone) {
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

    this.saveSystemEvents = function(systemEvent) {

        return new Promise((resolve, reject) => {
            var respuesta = new Object();

            $http.post('./sirius_repository/saveSystemEvents', systemEvent).then(function(systemEventResponse) {
                console.log("SYSTEM EVENT EN EL SERVICE: " + JSON.stringify(systemEventResponse));

                if (systemEventResponse['status'] === 200) {
                    respuesta.error = false;
                    respuesta.status = systemEventResponse['status'];

                    resolve(respuesta);
                } else {
                    respuesta.error = true;
                    respuesta.status = systemEventResponse['status'];

                    resolve(respuesta);
                }
            });

        });

    };
});