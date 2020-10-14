
var app = angular.module('ccportal');

//Sirius Controller
app.controller('SiriusController', function ($scope, NgTableParams, $http) {

    $scope.cliente = {};
    $scope.token = {};
    $scope.listaClientes = [];
    $scope.respuestaBusquedaCliente = {};

    $scope.clienteSeleccionado = {};
    $scope.vehiculos = [];
    $scope.vehiculoSeleccionado = {};

    $scope.numeroVin;


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
        $('#tblVehiculos').hide();
        $('#divAcciones').hide();

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

                    $('#Searching_Modal').modal('hide');

                    esCorrecto = false;
                }
            }
        }

        if (esCorrecto) {
            $('#Searching_Modal').modal('show');

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

                                        $scope.listaClientes.forEach(function (valor, indice, array) {
                                            valor.isSelected = false;
                                        });

                                        $scope.tableParams = new NgTableParams({filter: {}}, {dataset: $scope.listaClientes});
                                        $('#tblClientes').show();

                                        $('#Searching_Modal').modal('hide');
                                    } else {
                                        mensajeGeneral.addClass('alert alert-danger');
                                        mensajeGeneral.text('No se encontraron resultados');
                                        mensajeGeneral.show();
                                        divMensajeGeneral.show();

                                        $('#Searching_Modal').modal('hide');
                                    }
                                } else {
                                    $scope.respuestaBusquedaCliente = res['data'];
                                    if ($scope.respuestaBusquedaCliente.code !== null && $scope.respuestaBusquedaCliente.code !== '') {
                                        mensajeGeneral.addClass('alert alert-danger');
                                        mensajeGeneral.text('Error: ' + $scope.respuestaBusquedaCliente.status + ' ' + $scope.respuestaBusquedaCliente.message);
                                        mensajeGeneral.show();
                                        divMensajeGeneral.show();

                                        $('#Searching_Modal').modal('hide');
                                    }
                                }

                            } else {
                                mensajeGeneral.addClass('alert alert-danger');
                                mensajeGeneral.text('Error: ' + res['status'] + ' ' + res['message']);
                                mensajeGeneral.show();
                                divMensajeGeneral.show();

                                $('#Searching_Modal').modal('hide');
                            }
                        });

                    } else {
                        mensajeGeneral.addClass('alert alert-danger');
                        mensajeGeneral.text('No se pudo encontrar el token de acceso.<br/>' + 'Error: ' + response['status'] + ' ' + response['message']);
                        mensajeGeneral.show();
                        divMensajeGeneral.show();

                        $('#Searching_Modal').modal('hide');
                    }
                } else {
                    mensajeGeneral.addClass('alert alert-danger');
                    mensajeGeneral.text('Ocurrió  un problema al realizar la petición.<br/>' + 'Error: ' + response['status'] + ' ' + response['message']);
                    mensajeGeneral.show();
                    divMensajeGeneral.show();

                    $('#Searching_Modal').modal('hide');
                }

            });

        }

    };

    $scope.seleccionarCliente = function (data) {
        $scope.clienteSeleccionado = {};
        $scope.vehiculos = [];

        $('#tblVehiculos').hide();
        $('#mensajeGeneral').removeClass('alert alert-danger');
        $('#mensajeGeneral').text('');
        $('#mensajeGeneral').hide();
        $('#divMensajeGeneral').hide();
        $('#divAcciones').hide();

        var mensajeGeneral = $('#mensajeGeneral');
        var divMensajeGeneral = $('#divMensajeGeneral');

        console.log("CLIENTE SELECCIONADO: " + JSON.stringify(data));

        $scope.listaClientes.forEach(function (valor, indice, array) {
            if (!valor.isSelected && data === valor) {
                console.log("caundo los objetos con iguales");
                valor.isSelected = true;

                $scope.clienteSeleccionado = data;

                $scope.vehiculos = $scope.clienteSeleccionado.vehicles;

                if (typeof ($scope.vehiculos) !== 'undefined' && $scope.vehiculos !== null && $scope.vehiculos.length !== null && $scope.vehiculos.length > 0) {


                    $scope.vehiculos.forEach(function (valor, indice, array) {
                        valor.isSelected = false;
                    });
                    $scope.tableParamsVeviculos = new NgTableParams({filter: {}}, {dataset: $scope.vehiculos});

                    $('#tblVehiculos').show();
                    $('#divAcciones').show();
                } else {
                    mensajeGeneral.addClass('alert alert-danger');
                    mensajeGeneral.text('El cliente seleccionado no tiene vehículos asignados.');
                    mensajeGeneral.show();
                    divMensajeGeneral.show();
                }

            } else {
                valor.isSelected = false;
            }

        });



        $scope.tableParams = new NgTableParams({filter: {}}, {dataset: $scope.listaClientes});
    };

    $scope.seleccionarVehiculo = function (data) {
        console.log("VEHICULO SELECCIONADO: " + JSON.stringify(data));

        $scope.vehiculos.forEach(function (valor, indice, array) {
            if (!valor.isSelected && data === valor) {
                $scope.vehiculoSeleccionado = data;
                $scope.vehiculoSeleccionado.isSelected = true;
            } else {
                valor.isSelected = false;
                $scope.vehiculoSeleccionado = {};
            }
        });

    };
});

