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

                            respuesta.error = false;
                            respuesta.status = respuestaObject['status'];
                            respuesta.message = respuestaObject['message'];
                            respuesta.usuario = usuarioResponse;
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

});

