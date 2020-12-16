var app = angular.module('ccportal');

app.service('LogService', function ($http) {

    this.consultarLogs = function (logsBusqueda) {

        return new Promise((resolve, reject) => {
            var respuesta = new Object();

            $http.post('./sirius_repository/getLogs', logsBusqueda).then(function (response) {
                console.log("RESPUESTA EN EL SERVICE [consultarLogs/getLogs]: " + JSON.stringify(response));

                var respuestaObject;
                if (response['status'] === 200) {
                    respuestaObject = response['data'];

                    if (respuestaObject['logs'] !== null && respuestaObject['logs'] !== '' && typeof (respuestaObject['logs']) !== 'undefined') {
                        var logsResponse = respuestaObject['logs'];
                        console.log("LOGS RESPONSE EN EL SERVICE: " + JSON.stringify(logsResponse));

                        if (logsResponse !== null && logsResponse.length > 0) {

                            respuesta.error = false;
                            respuesta.status = respuestaObject['status'];
                            respuesta.message = respuestaObject['message'];
                            respuesta.logs = logsResponse;
                            resolve(respuesta);
                        } else {
                            respuesta.error = false;
                            respuesta.status = response['status'];
                            respuesta.message = 'No se encontro información';
                            respuesta.logs = null;
                            resolve(respuesta);
                        }

                    } else {
                        respuesta.error = true;
                        respuesta.status = response['status'];
                        respuesta.message = 'No se encontro información';
                        respuesta.logs = null;
                        resolve(respuesta);
                    }
                } else {
                    respuesta.error = true;
                    respuesta.status = response['status'];
                    respuesta.message = 'Error al consultar los logs SIRIUS: ' + response['message'];
                    respuesta.logs = null;
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

