var app = angular.module('ccportal');

app.service('ShellService', function ($http) {

    this.consultaTokenMzone = function () {

        return new Promise((resolve, reject) => {
            var respuesta = new Object();
            $http.get('./sirius_route/getTokenMzone').then(function (response) {
                console.log("RESPUESTA EN EL SERVICE [consultaTokenMzone]: " + JSON.stringify(response));

                var respuestaObject;
                var token;

                if (response['status'] === 200) {
                    respuestaObject = response['data'];

                    if (respuestaObject !== null) {

                        if (respuestaObject['access_token'] !== null && respuestaObject['access_token'] !== '' && typeof (respuestaObject['access_token']) !== 'undefined') {
                            token = respuestaObject['access_token'];

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

    this.consultaShellsMzone = function (token) {

        console.log("TOKEN EN EL SERVICE [consultaShellsMzone]: " + JSON.stringify(token));

        return new Promise((resolve, reject) => {
            var respuesta = new Object();
            $http.post('./sirius_route/getShellsMzone', token).then(function (response) {
                console.log("RESPUESTA EN EL SERVICE [consultaShellsMzone]: " + JSON.stringify(response));

                var respuestaObject;
                var listaShells = [];
                if (response['status'] === 200) {
                    respuestaObject = response['data'];

                    if (respuestaObject !== null) {

                        if (Array.isArray(respuestaObject['value'])) {

                            listaShells = respuestaObject['value'];
                            if (typeof (listaShells) !== 'undefined' && listaShells !== null && listaShells.length !== null && listaShells.length > 0) {

                                listaShells.forEach(function (valor, indice, array) {
                                    valor.isSelected = false;
                                });

                                respuesta.error = false;
                                respuesta.status = null;
                                respuesta.message = null;
                                respuesta.lista = listaShells;
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

    this.consultarShells = function () {

        return new Promise((resolve, reject) => {
            var respuesta = new Object();

            $http.post('./sirius_repository/getShells').then(function (response) {
                console.log("RESPUESTA EN EL SERVICE [consultarShells/getShells]: " + JSON.stringify(response));

                var respuestaObject;
                if (response['status'] === 200) {
                    respuestaObject = response['data'];

                    if (respuestaObject['shells'] !== null && respuestaObject['shells'] !== '' && typeof (respuestaObject['shells']) !== 'undefined') {
                        var shellsResponse = respuestaObject['shells'];
                        console.log("SHELLS RESPONSE EN EL SERVICE: " + JSON.stringify(shellsResponse));

                        if (shellsResponse !== null && shellsResponse.length > 0) {

                            respuesta.error = false;
                            respuesta.status = respuestaObject['status'];
                            respuesta.message = respuestaObject['message'];
                            respuesta.shells = shellsResponse;
                            resolve(respuesta);
                        } else {
                            respuesta.error = false;
                            respuesta.status = response['status'];
                            respuesta.message = 'No se encontro informacion';
                            respuesta.shells = null;
                            resolve(respuesta);
                        }

                    } else {
                        respuesta.error = true;
                        respuesta.status = response['status'];
                        respuesta.message = 'No se encontro informacion';
                        respuesta.shells = null;
                        resolve(respuesta);
                    }
                } else {
                    respuesta.error = true;
                    respuesta.status = response['status'];
                    respuesta.message = 'Error al consultar los cascarones MProfile: ' + response['message'];
                    respuesta.shells = null;
                    resolve(respuesta);
                }
            });

        });
    };

    this.registrarShell = function (shell) {

        console.log("SHELL EN EL SERVICE: " + JSON.stringify(shell));

        return new Promise((resolve, reject) => {
            var respuesta = new Object();
            $http.post('./sirius_repository/saveShell', shell).then(function (response) {
                console.log("RESPUESTA EN EL SERVICE [registrarShell]: " + JSON.stringify(response));

                var respuestaObject;

                if (response['status'] === 200) {
                    respuestaObject = response['data'];

                    respuesta.error = false;
                    respuesta.status = null;
                    respuesta.message = "Registro de Shell exitoso";
                    respuesta.svcReqId = respuestaObject['shell'];
                    resolve(respuesta);


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

    this.actualizarShell = function (shell) {

        console.log("SHELL EN EL SERVICE: " + JSON.stringify(shell));

        return new Promise((resolve, reject) => {
            var respuesta = new Object();
            $http.post('./sirius_repository/updateShell', shell).then(function (response) {
                console.log("RESPUESTA EN EL SERVICE [actualizarShell]: " + JSON.stringify(response));

                var respuestaObject;

                if (response['status'] === 200) {
                    respuestaObject = response['data'];

                    respuesta.error = false;
                    respuesta.status = null;
                    respuesta.message = "Actualización de Shell exitoso";
                    respuesta.svcReqId = respuestaObject['shell'];
                    resolve(respuesta);


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

    this.saveSystemEvents = function (systemEvent) {

        return new Promise((resolve, reject) => {
            var respuesta = new Object();

            $http.post('./sirius_repository/saveSystemEvents', systemEvent).then(function (systemEventResponse) {
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

