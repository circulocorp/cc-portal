var app = angular.module('ccportal');

app.service('LoginService', function ($http) {

    this.consultarUsuario = function (usuario) {

        return new Promise((resolve, reject) => {
            var respuesta = new Object();

            console.log("USUARIO JSON EN EL SERVICE: " + JSON.stringify(usuario));

            $http.post('./sirius_repository/getUsuario', usuario).then(function (response) {
                console.log("RESPUESTA EN EL SERVICE [consultarUsuario/getUsuario]: " + JSON.stringify(response));

                var respuestaObject;
                if (response['status'] === 200) {
                    respuestaObject = response['data'];

                    if (respuestaObject['usuario'] !== null && respuestaObject['usuario'] !== '' && typeof (respuestaObject['usuario']) !== 'undefined') {
                        var usuarioResponse = respuestaObject['usuario'];
                        console.log("USUARIO RESPONSE EN EL SERVICE: " + JSON.stringify(usuarioResponse));

                        if (usuarioResponse !== null && usuarioResponse.length > 0) {

                            usuarioResponse.environment = respuestaObject['environment'];

                            respuesta.error = false;
                            respuesta.status = respuestaObject['status'];
                            respuesta.message = respuestaObject['message'];
                            respuesta.usuario = usuarioResponse;
                            respuesta.environment = respuestaObject['environment'];

                            var systemEvent = new Object();
                            systemEvent.date = moment().format('YYYY/MM/DD HH:mm:ss');
                            systemEvent.userEmail = respuesta.usuario[0].user;
                            systemEvent.userName = respuesta.usuario[0].first_names + " " + respuesta.usuario[0].last_names;
                            systemEvent.action = "INICIO DE SESIÓN";
                            systemEvent.observation = "El usuario " + respuesta.usuario[0].user + " inicio sesión con exito";

                            $http.post('./sirius_repository/saveSystemEvents', systemEvent).then(function (systemEventResponse) {
                                console.log("SYSTEM EVENT EN EL SERVICE: " + JSON.stringify(systemEventResponse));
                            });

                            resolve(respuesta);
                        } else {
                            respuesta.error = true;
                            respuesta.status = response['status'];
                            respuesta.message = 'No se encontro el usuario';
                            respuesta.usuario = null;
                            resolve(respuesta);
                        }

                    } else {
                        respuesta.error = true;
                        respuesta.status = response['status'];
                        respuesta.message = 'No se encontro el usuario';
                        respuesta.usuario = null;
                        resolve(respuesta);
                    }
                } else {
                    respuesta.error = true;
                    respuesta.status = response['status'];
                    respuesta.message = 'Error al consultar el usuario: ' + response['message'];
                    respuesta.usuario = null;
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

