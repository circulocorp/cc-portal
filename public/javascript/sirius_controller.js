
var app = angular.module('ccportal', ['ngTable']);

//Sirius Controller
app.controller('SiriusController', function ($scope, NgTableParams, $http, SiriusService) {

    $scope.cliente = {};
    //$scope.token = {};
    $scope.listaClientes = [];
    //$scope.respuestaBusquedaCliente = {};

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
            mensaje.text('¡Debe ingresar el menos un dato de búsqueda!');
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
                    mensaje.text('¡El email no tiene el formato correcto!');
                    mensaje.show();

                    $('#Searching_Modal').modal('hide');


                    esCorrecto = false;
                }
            }
        }

        if (esCorrecto) {
            $('#Searching_Modal').modal('show');


            //Consultamos el token SXMIDMLogin
            SiriusService.consultaTokenSXMIDMLogin().then(response => {
                console.log("RESPUESTA EN EL CONTROLLER: " + JSON.stringify(response));

                if (!response.error) {
                    //$scope.token = response.token;
                    console.log("TOKEN EN EL CONTROLLER: " + response.token);

                    //Consultamos el cliente
                    $scope.cliente.token = response.token;

                    SiriusService.consultaCliente($scope.cliente).then(response => {
                        console.log("RESPUESTA EN EL CONTROLLER: " + JSON.stringify(response));

                        if (!response.error) {
                            $scope.listaClientes = response.lista;
                            console.log("LISTA EN EL CONTROLLER: " + JSON.stringify($scope.listaClientes));

                            $scope.tableParams = new NgTableParams({}, {dataset: $scope.listaClientes});
                            $scope.tableParams.reload();

                            $('#tblClientes').show();
                            $('#Searching_Modal').modal('hide');

                        } else {
                            mensajeGeneral.addClass('alert alert-danger');
                            if (response.status === 1002) {
                                mensajeGeneral.text(response.message);
                            } else {
                                mensajeGeneral.text('Ocurrio un problema al consultar el cliente.\n' + 'Error: ' + response.status + ' ' + response.message);
                            }

                            mensajeGeneral.show();
                            divMensajeGeneral.show();
                            window.scrollTo(0, 0);

                            $('#Searching_Modal').modal('hide');
                        }

                    });

                } else {
                    mensajeGeneral.addClass('alert alert-danger');
                    mensajeGeneral.text('Ocurrio un problema la obtener el token SXM-IDM-Login.\n' + 'Error: ' + response.status + ' ' + response.message);
                    mensajeGeneral.show();
                    divMensajeGeneral.show();
                    window.scrollTo(0, 0);

                    $('#Searching_Modal').modal('hide');
                }

            });

        }

    };

    $scope.seleccionarCliente = function (data) {
        $scope.clienteSeleccionado = {};
        $scope.vehiculos = [];
        $scope.vehiculoSeleccionado = {};

        $('#tblVehiculos').hide();
        $('#mensajeGeneral').removeClass('alert alert-danger');
        $('#mensajeGeneral').text('');
        $('#mensajeGeneral').hide();
        $('#divMensajeGeneral').hide();
        $('#divAcciones').hide();

        $('#vin').removeClass('is-invalid');
        $('#vin').removeClass('is-valid');

        $('#mensajeVin').removeClass('invalid-feedback');
        $('#mensajeVin').removeClass('valid-feedback');
        $('#mensajeVin').text('');
        $('#mensajeVin').hide();

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
                    $scope.tableParams.reload();

                    $('#tblVehiculos').show();
                    $('#divAcciones').show();
                } else {
                    mensajeGeneral.addClass('alert alert-danger');
                    mensajeGeneral.text('El cliente seleccionado no tiene vehículos asignados.');
                    mensajeGeneral.show();
                    divMensajeGeneral.show();
                    window.scrollTo(0, 0);
                }

            } else {
                valor.isSelected = false;
            }

        });

        $scope.tableParams = new NgTableParams({filter: {}}, {dataset: $scope.listaClientes});
    };

    $scope.seleccionarVehiculo = function (data) {
        console.log("VEHICULO SELECCIONADO: " + JSON.stringify(data));
        $scope.vehiculoSeleccionado = {};

        $('#vin').removeClass('is-invalid');
        $('#vin').removeClass('is-valid');

        $('#mensajeVin').removeClass('invalid-feedback');
        $('#mensajeVin').removeClass('valid-feedback');
        $('#mensajeVin').text('');
        $('#mensajeVin').hide();

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

    $scope.activarLocalizacion = function () {
        $scope.token_sxm_idm_login = {};
        $scope.token_sxm_cloud = {};

        $('#vin').removeClass('is-invalid');
        $('#vin').removeClass('is-valid');

        $('#mensajeVin').removeClass('invalid-feedback');
        $('#mensajeVin').removeClass('valid-feedback');
        $('#mensajeVin').text('');
        $('#mensajeVin').hide();

        $('#mensajeGeneral').removeClass('alert alert-danger');
        $('#mensajeGeneral').removeClass('alert alert-success');
        $('#mensajeGeneral').text('');
        $('#mensajeGeneral').hide();
        $('#divMensajeGeneral').hide();

        var vin = $scope.vehiculoSeleccionado.vin;
        var mensajeVin = $('#mensajeVin');
        var mensajeGeneral = $('#mensajeGeneral');
        var divMensajeGeneral = $('#divMensajeGeneral');

        var esCorrecto = true;

        if (vin === null || vin === '' || typeof (vin) === 'undefined') {

            $('#vin').addClass('is-invalid');

            mensajeVin.addClass('invalid-feedback');
            mensajeVin.text('Debe ingresar el número VIN');
            mensajeVin.show();

            esCorrecto = false;
        } else {
            if (vin.length !== 17) {
                $('#vin').addClass('is-invalid');

                mensajeVin.addClass('invalid-feedback');
                mensajeVin.text('El numero VIN debe de ser de 17 caracteres');
                mensajeVin.show();

                esCorrecto = false;
            }

        }

        console.log("VIN: " + vin);

        if (esCorrecto) {
            $('#Searching_Modal').modal('show');

            //Consultamos el token SXMIDMLogin
            SiriusService.consultaTokenSXMIDMLogin().then(response => {
                console.log("RESPUESTA EN EL CONTROLLER: " + JSON.stringify(response));

                if (!response.error) {
                    var tokenSXMIDMLogin = response.token;
                    console.log("TOKEN EN EL CONTROLLER: " + tokenSXMIDMLogin);

                    //Consultamos el token SXMCloud
                    SiriusService.consultaTokenSXMCloud().then(response => {
                        console.log("RESPUESTA EN EL CONTROLLER: " + JSON.stringify(response));

                        if (!response.error) {
                            var tokenSXMCloud = response.token;
                            console.log("TOKEN EN EL CONTROLLER: " + tokenSXMCloud);

                            var vinRequest = {};
                            vinRequest.tokenSXMIDMLogin = tokenSXMIDMLogin;
                            vinRequest.tokenSXMCloud = tokenSXMCloud;
                            vinRequest.vin = vin;

                            SiriusService.consultaEstatusLocalizacion(vinRequest).then(response => {
                                console.log("RESPUESTA EN EL CONTROLLER: " + JSON.stringify(response));

                                if (!response.error) {

                                    if (response.status === 1005) {
                                        //Aqui activamos la localizacion
                                        SiriusService.activarLocalizacion(vinRequest).then(response => {
                                            console.log("RESPUESTA EN EL CONTROLLER: " + JSON.stringify(response));

                                            if (!response.error) {
                                                var svcReqId = response.svcReqId;
                                                console.log("ID EN EL CONTROLLER: " + svcReqId);

                                                mensajeGeneral.addClass('alert alert-success');
                                                mensajeGeneral.text('La activación de localización del vehículo con el vin ' + vin + ' se realizó conexito.');
                                                mensajeGeneral.show();
                                                divMensajeGeneral.show();
                                                window.scrollTo(0, 0);

                                                $('#Searching_Modal').modal('hide');
                                            } else {
                                                mensajeGeneral.addClass('alert alert-danger');
                                                mensajeGeneral.text('Ocurrió un problema al activar la localización del vehículo con el vin ' + vin + '.\n' + 'Error: ' + response.status + ' ' + response.message);
                                                mensajeGeneral.show();
                                                divMensajeGeneral.show();
                                                window.scrollTo(0, 0);

                                                $('#Searching_Modal').modal('hide');
                                            }
                                        });
                                    }
                                } else {
                                    mensajeGeneral.addClass('alert alert-danger');

                                    if (response.status === 1003 || response.status === 1004) {
                                        mensajeGeneral.text(response.message);
                                    } else {
                                        mensajeGeneral.text('Ocurrió un problema al consultar el estatus del vehículo.\n' + 'Error: ' + response.status + ' ' + response.message);
                                    }


                                    mensajeGeneral.show();
                                    divMensajeGeneral.show();
                                    window.scrollTo(0, 0);

                                    $('#Searching_Modal').modal('hide');
                                }
                            });


                        } else {
                            mensajeGeneral.addClass('alert alert-danger');
                            mensajeGeneral.text('Ocurrió un problema la obtener el token SXM-IDM-Login.\n' + 'Error: ' + response.status + ' ' + response.message);
                            mensajeGeneral.show();
                            divMensajeGeneral.show();
                            window.scrollTo(0, 0);

                            $('#Searching_Modal').modal('hide');
                        }
                    });

                } else {
                    mensajeGeneral.addClass('alert alert-danger');
                    mensajeGeneral.text('Ocurrió un problema la obtener el token SXM-IDM-Login.\n' + 'Error: ' + response.status + ' ' + response.message);
                    mensajeGeneral.show();
                    divMensajeGeneral.show();
                    window.scrollTo(0, 0);

                    $('#Searching_Modal').modal('hide');
                }
            });

        }

    };

    $scope.activarBloqueo = function () {

    };

    $scope.aplazarLocalizacion = function () {

    };

    $scope.cancelarLocalizacion = function () {
        $scope.token_sxm_idm_login = {};
        $scope.token_sxm_cloud = {};

        $('#vin').removeClass('is-invalid');
        $('#vin').removeClass('is-valid');

        $('#mensajeVin').removeClass('invalid-feedback');
        $('#mensajeVin').removeClass('valid-feedback');
        $('#mensajeVin').text('');
        $('#mensajeVin').hide();

        $('#mensajeGeneral').removeClass('alert alert-danger');
        $('#mensajeGeneral').removeClass('alert alert-success');
        $('#mensajeGeneral').text('');
        $('#mensajeGeneral').hide();
        $('#divMensajeGeneral').hide();

        var vin = $scope.vehiculoSeleccionado.vin;
        var mensajeVin = $('#mensajeVin');
        var mensajeGeneral = $('#mensajeGeneral');
        var divMensajeGeneral = $('#divMensajeGeneral');

        var esCorrecto = true;

        if (vin === null || vin === '' || typeof (vin) === 'undefined') {

            $('#vin').addClass('is-invalid');

            mensajeVin.addClass('invalid-feedback');
            mensajeVin.text('Debe ingresar el número VIN');
            mensajeVin.show();

            esCorrecto = false;
        } else {
            if (vin.length !== 17) {
                $('#vin').addClass('is-invalid');

                mensajeVin.addClass('invalid-feedback');
                mensajeVin.text('El numero VIN debe de ser de 17 caracteres');
                mensajeVin.show();

                esCorrecto = false;
            }

        }

        console.log("VIN: " + vin);

        if (esCorrecto) {
            $('#Searching_Modal').modal('show');

            //Consultamos el token SXMIDMLogin
            SiriusService.consultaTokenSXMIDMLogin().then(response => {
                console.log("RESPUESTA EN EL CONTROLLER: " + JSON.stringify(response));

                if (!response.error) {
                    var tokenSXMIDMLogin = response.token;
                    console.log("TOKEN EN EL CONTROLLER: " + tokenSXMIDMLogin);

                    //Consultamos el token SXMCloud
                    SiriusService.consultaTokenSXMCloud().then(response => {
                        console.log("RESPUESTA EN EL CONTROLLER: " + JSON.stringify(response));

                        if (!response.error) {
                            var tokenSXMCloud = response.token;
                            console.log("TOKEN EN EL CONTROLLER: " + tokenSXMCloud);

                            var vinRequest = {};
                            vinRequest.tokenSXMIDMLogin = tokenSXMIDMLogin;
                            vinRequest.tokenSXMCloud = tokenSXMCloud;
                            vinRequest.vin = vin;

                            SiriusService.consultaEstatusLocalizacion(vinRequest).then(response => {
                                console.log("RESPUESTA EN EL CONTROLLER: " + JSON.stringify(response));

                                if (!response.error) {
                                    if (response.status === 1005) {
                                        mensajeGeneral.addClass('alert alert-danger');
                                        mensajeGeneral.text('Ocurrió un problema la obtener el token SXM-IDM-Login.\n' + 'Error: ' + response.status + ' ' + response.message);
                                        mensajeGeneral.show();
                                        divMensajeGeneral.show();
                                        window.scrollTo(0, 0);

                                        $('#Searching_Modal').modal('hide');
                                    } 

                                } else {

                                    if (response.status === 1004) {
                                        //Aqui cancelamos la localizacion
                                        SiriusService.cancelarLocalizacion(vinRequest).then(response => {
                                            console.log("RESPUESTA EN EL CONTROLLER: " + JSON.stringify(response));

                                            if (!response.error) {
                                                var svcReqId = response.svcReqId;
                                                console.log("ID EN EL CONTROLLER: " + svcReqId);

                                                mensajeGeneral.addClass('alert alert-success');
                                                mensajeGeneral.text('La cancelación de localización del vehículo con el vin ' + vin + ' se realizó conexito.');
                                                mensajeGeneral.show();
                                                divMensajeGeneral.show();
                                                window.scrollTo(0, 0);

                                                $('#Searching_Modal').modal('hide');
                                            } else {
                                                mensajeGeneral.addClass('alert alert-danger');
                                                mensajeGeneral.text('Ocurrió un problema al cancelar la localización del vehículo con el vin ' + vin + '.\n' + 'Error: ' + response.status + ' ' + response.message);
                                                mensajeGeneral.show();
                                                divMensajeGeneral.show();
                                                window.scrollTo(0, 0);

                                                $('#Searching_Modal').modal('hide');
                                            }
                                        });

                                    } else {
                                        mensajeGeneral.addClass('alert alert-danger');

                                        if (response.status === 1003) {
                                            mensajeGeneral.text(response.message);
                                        } else {
                                            mensajeGeneral.text('Ocurrió un problema al consultar el estatus del vehículo.\n' + 'Error: ' + response.status + ' ' + response.message);
                                        }


                                        mensajeGeneral.show();
                                        divMensajeGeneral.show();
                                        window.scrollTo(0, 0);

                                        $('#Searching_Modal').modal('hide');
                                    }

                                }
                            });


                        } else {
                            mensajeGeneral.addClass('alert alert-danger');
                            mensajeGeneral.text('Ocurrió un problema la obtener el token SXM-IDM-Login.\n' + 'Error: ' + response.status + ' ' + response.message);
                            mensajeGeneral.show();
                            divMensajeGeneral.show();
                            window.scrollTo(0, 0);

                            $('#Searching_Modal').modal('hide');
                        }
                    });

                } else {
                    mensajeGeneral.addClass('alert alert-danger');
                    mensajeGeneral.text('Ocurrió un problema la obtener el token SXM-IDM-Login.\n' + 'Error: ' + response.status + ' ' + response.message);
                    mensajeGeneral.show();
                    divMensajeGeneral.show();
                    window.scrollTo(0, 0);

                    $('#Searching_Modal').modal('hide');
                }
            });

        }

    };


});



