
var app = angular.module('ccportal');

//Sirius Controller
app.controller('SiriusController', function ($scope, NgTableParams, $http) {
    $scope.cliente = {};
    $scope.token = {};
    $scope.listaClientes = [];
    $scope.respuestaBusquedaCleinte = {};

    $scope.consultarCliente = function () {

        $('#nombre').removeClass('is-invalid');
        $('#apellido').removeClass('is-invalid');
        $('#email').removeClass('is-invalid');
        $('#mensaje').removeClass('invalid-feedback');

        $('#nombre').removeClass('is-valid');
        $('#apellido').removeClass('is-valid');
        $('#email').removeClass('is-valid');
        $('#mensaje').removeClass('valid-feedback');
        $('#mensaje').text('');
        $('#mensaje').hide();

        $('#mensajeGeneral').removeClass('alert alert-danger');
        $('#mensajeGeneral').text('');
        $('#mensajeGeneral').hide();
        $('#divMensajeGeneral').hide();

        $('#tblClientes').hide();

        var nombre = $scope.cliente.nombre;
        var apellido = $scope.cliente.apellido;
        var email = $scope.cliente.email;
        var mensaje = $('#mensaje');
        var mensajeGeneral = $('#mensajeGeneral');
        var divMensajeGeneral = $('#divMensajeGeneral');
        var esCorrecto = true;

        console.log(nombre);
        console.log(apellido);
        console.log(email);

        if ((nombre === null || nombre === '' || typeof (nombre) === 'undefined') && (apellido === null || apellido === '' || typeof (apellido) === 'undefined') && (email === null || email === '' || typeof (email) === 'undefined')) {
            console.log("entro al if");

            $scope.cliente = {};

            $('#nombre').addClass('is-invalid');
            $('#apellido').addClass('is-invalid');
            $('#email').addClass('is-invalid');

            mensaje.addClass('invalid-feedback');
            mensaje.text('Debe ingresar el menos un dato de búsqueda');
            mensaje.show();


            esCorrecto = false;
        } else {
            console.log("entro al else");

            if (email !== null && email !== '' && typeof (email) !== 'undefined') {
                console.log("valido el email");

                if (!validarEmail(email)) {
                    console.log("cuando el email no es correcto");

                    $('#email').addClass('is-invalid');

                    mensaje.addClass('invalid-feedback');
                    mensaje.text('El email no tiene el formato correcto');
                    mensaje.show();

                    esCorrecto = false;
                }
            }
        }

        if (esCorrecto) {
            $http.get('./sirius_route/obtenberToken').then(function (response) {
                //var respuestaToken = JSON.stringify(response)
                console.log("RESPONSE EN EL CONTROLLER: " + response);

                if (response['status'] === 200) {
                    $scope.token = response['data'];

                    if ($scope.token !== null && $scope.token.access_token) {
                        $scope.cliente.token = $scope.token.access_token;

                        console.log("TOKEN: " + $scope.token.access_token);


                        $http.post('./sirius_route/consultarCliente', $scope.cliente).then(function (res) {
                            console.log("RESPUESTA CONSULTA DE CLIENTE: " + JSON.stringify(res));

                            if (res['status'] === 200) {

                                if (Array.isArray(res['data'])) {
                                    $scope.listaClientes = res['data'];
                                    if (typeof ($scope.listaClientes) !== 'undefined' && $scope.listaClientes !== null && $scope.listaClientes.length !== null && $scope.listaClientes.length > 0) {
                                        $scope.tableParams = new NgTableParams({filter: {}}, {dataset: $scope.listaClientes});
                                        $('#tblClientes').show();
                                    } else {
                                        mensajeGeneral.addClass('alert alert-danger');
                                        mensajeGeneral.text('No se encontraron resultados');
                                        mensajeGeneral.show();
                                        divMensajeGeneral.show();
                                    }
                                } else {
                                    $scope.respuestaBusquedaCleinte = res['data'];
                                    if ($scope.respuestaBusquedaCleinte.code !== null && $scope.respuestaBusquedaCleinte.code !== '') {
                                        mensajeGeneral.addClass('alert alert-danger');
                                        mensajeGeneral.text('Error: ' + $scope.respuestaBusquedaCleinte.status + ' ' + $scope.respuestaBusquedaCleinte.message);
                                        mensajeGeneral.show();
                                        divMensajeGeneral.show();
                                    }
                                }

                            } else {
                                mensajeGeneral.addClass('alert alert-danger');
                                mensajeGeneral.text('Error: ' + res['status'] + ' ' + res['message']);
                                mensajeGeneral.show();
                                divMensajeGeneral.show();
                            }
                        });

                    } else {
                        mensajeGeneral.addClass('alert alert-danger');
                        mensajeGeneral.text('No se pudo encontrar el token de acceso.<br/>' + 'Error: ' + response['status'] + ' ' + response['message']);
                        mensajeGeneral.show();
                        divMensajeGeneral.show();
                    }
                } else {
                    mensajeGeneral.addClass('alert alert-danger');
                    mensajeGeneral.text('Ocurrió  un problema al realizar la petición.<br/>' + 'Error: ' + response['status'] + ' ' + response['message']);
                    mensajeGeneral.show();
                    divMensajeGeneral.show();
                }

            });

        }

    };

    $scope.seleccionarCliente = function (data) {
        console.log("CLIENTE SELECCIONADO: "+JSON.stringify(data));
    };
});

