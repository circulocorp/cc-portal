
var app = angular.module('ccportal', ['ngTable']);

//Sirius Controller
app.controller('SiriusController', function ($scope, NgTableParams, $http, SiriusService) {

    $scope.cliente = {};
    $scope.listaClientes = [];
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

        if ((nombre === null || nombre === '' || typeof (nombre) === 'undefined') && (apellido === null || apellido === '' || typeof (apellido) === 'undefined') && (email === null || email === '' || typeof (email) === 'undefined')) {
            $scope.cliente = {};

            $('#nombre').addClass('is-invalid');
            $('#apellido').addClass('is-invalid');
            $('#email').addClass('is-invalid');

            mensaje.addClass('invalid-feedback');
            mensaje.text('¡Debe ingresar el menos un dato de búsqueda!');
            mensaje.show();

            esCorrecto = false;
        } else {

            if (email !== null && email !== '' && typeof (email) !== 'undefined') {

                if (!validarEmail(email)) {
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
                console.log("RESPUESTA EN EL CONTROLLER [consultaTokenSXMIDMLogin]: " + JSON.stringify(response));

                if (!response.error) {

                    //Consultamos el cliente
                    $scope.cliente.token = response.token;

                    SiriusService.consultaCliente($scope.cliente).then(response => {
                        console.log("RESPUESTA EN EL CONTROLLER [consultaCliente]: " + JSON.stringify(response));

                        if (!response.error) {
                            $scope.listaClientes = response.lista;

                            $scope.tableParams = new NgTableParams({}, {dataset: $scope.listaClientes});
                            $scope.tableParams.reload();

                            $('#tblClientes').show();
                            $('#Searching_Modal').modal('hide');

                        } else {
                            mensajeGeneral.addClass('alert alert-danger');
                            if (response.status === 1003) {
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

        $scope.listaClientes.forEach(function (valor, indice, array) {
            if (!valor.isSelected && data === valor) {

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

    $scope.consultarLocalizacion = function () {
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

        if (esCorrecto) {
            $('#Searching_Modal').modal('show');

            //Consultamos el token SXMIDMLogin
            SiriusService.consultaTokenSXMIDMLogin().then(response => {
                console.log("RESPUESTA EN EL CONTROLLER [consultaTokenSXMIDMLogin]: " + JSON.stringify(response));

                if (!response.error) {
                    var tokenSXMIDMLogin = response.token;

                    //Consultamos el token SXMCloud
                    SiriusService.consultaTokenSXMCloud().then(response => {
                        console.log("RESPUESTA EN EL CONTROLLER [consultaTokenSXMCloud]: " + JSON.stringify(response));

                        if (!response.error) {
                            var tokenSXMCloud = response.token;

                            var vinRequest = {};
                            vinRequest.tokenSXMIDMLogin = tokenSXMIDMLogin;
                            vinRequest.tokenSXMCloud = tokenSXMCloud;
                            vinRequest.vin = vin;

                            SiriusService.consultaEstatusLocalizacion(vinRequest).then(response => {
                                console.log("RESPUESTA EN EL CONTROLLER [consultaEstatusLocalizacion]: " + JSON.stringify(response));

                                if (!response.error) {

                                    mensajeGeneral.addClass('alert alert-success');
                                    mensajeGeneral.text('Localizacion encontrada: ' + JSON.stringify(response) + ' .');
                                    mensajeGeneral.show();
                                    divMensajeGeneral.show();
                                    window.scrollTo(0, 0);

                                    $('#Searching_Modal').modal('hide');

                                } else {
                                    mensajeGeneral.addClass('alert alert-danger');

                                    if (response.status === 1004 || response.status === 1005 || response.status === 1006 || response.status === 1007 || response.status === 1008) {
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

        if (esCorrecto) {
            $('#Searching_Modal').modal('show');

            //Consultamos el token SXMIDMLogin
            SiriusService.consultaTokenSXMIDMLogin().then(response => {
                console.log("RESPUESTA EN EL CONTROLLER [consultaTokenSXMIDMLogin]: " + JSON.stringify(response));

                if (!response.error) {
                    var tokenSXMIDMLogin = response.token;

                    //Consultamos el token SXMCloud
                    SiriusService.consultaTokenSXMCloud().then(response => {
                        console.log("RESPUESTA EN EL CONTROLLER [consultaTokenSXMCloud]: " + JSON.stringify(response));

                        if (!response.error) {
                            var tokenSXMCloud = response.token;

                            var vinRequest = {};
                            vinRequest.tokenSXMIDMLogin = tokenSXMIDMLogin;
                            vinRequest.tokenSXMCloud = tokenSXMCloud;
                            vinRequest.vin = vin;
                            vinRequest.sessionId = generateUUID();

                            console.log("SESSION ID: " + vinRequest.sessionId);

                            SiriusService.consultaEstatusLocalizacion(vinRequest).then(response => {
                                console.log("RESPUESTA EN EL CONTROLLER [consultaEstatusLocalizacion]: " + JSON.stringify(response));

                                if (!response.error) {

                                    if (response.status === 1005) {
                                        //Aqui activamos la localizacion
                                        SiriusService.activarLocalizacion(vinRequest).then(response => {
                                            console.log("RESPUESTA EN EL CONTROLLER [activarLocalizacion]: " + JSON.stringify(response));

                                            if (!response.error) {
                                                var svcReqId = response.svcReqId;

                                                //sleep(2000);
                                                SiriusService.consultaEstatusLocalizacion(vinRequest).then(response => {
                                                    if (response.tracker) {
                                                        mensajeGeneral.addClass('alert alert-danger');
                                                        mensajeGeneral.text('Ocurrió un problema al activar la localización del vehículo con el vin ' + vin + '.\n' + 'Error: ' + response.status + ' ' + response.message);
                                                        mensajeGeneral.show();
                                                        divMensajeGeneral.show();
                                                        window.scrollTo(0, 0);

                                                        $('#Searching_Modal').modal('hide');
                                                    } else {
                                                        mensajeGeneral.addClass('alert alert-success');
                                                        mensajeGeneral.text('La activación de localización del vehículo con el vin ' + vin + ' se realizó con exito.');
                                                        mensajeGeneral.show();
                                                        divMensajeGeneral.show();
                                                        window.scrollTo(0, 0);

                                                        $('#Searching_Modal').modal('hide');
                                                    }
                                                });


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

                                    if (response.status === 1004 || response.status === 1006 || response.status === 1007 || response.status === 1008) {
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

        if (esCorrecto) {
            $('#Searching_Modal').modal('show');

            //Consultamos el token SXMIDMLogin
            SiriusService.consultaTokenSXMIDMLogin().then(response => {
                console.log("RESPUESTA EN EL CONTROLLER [consultaTokenSXMIDMLogin]: " + JSON.stringify(response));

                if (!response.error) {
                    var tokenSXMIDMLogin = response.token;

                    //Consultamos el token SXMCloud
                    SiriusService.consultaTokenSXMCloud().then(response => {
                        console.log("RESPUESTA EN EL CONTROLLER [consultaTokenSXMCloud]: " + JSON.stringify(response));

                        if (!response.error) {
                            var tokenSXMCloud = response.token;

                            var vinRequest = {};
                            vinRequest.tokenSXMIDMLogin = tokenSXMIDMLogin;
                            vinRequest.tokenSXMCloud = tokenSXMCloud;
                            vinRequest.vin = vin;

                            //sleep(2000);
                            SiriusService.consultaEstatusLocalizacion(vinRequest).then(response => {
                                console.log("RESPUESTA EN EL CONTROLLER [consultaEstatusLocalizacion]: " + JSON.stringify(response));

                                if (!response.error) {
                                    if (response.status === 1005) {
                                        mensajeGeneral.addClass('alert alert-danger');
                                        mensajeGeneral.text(response.status + ' ' + response.message);
                                        mensajeGeneral.show();
                                        divMensajeGeneral.show();
                                        window.scrollTo(0, 0);

                                        $('#Searching_Modal').modal('hide');
                                    }

                                } else {

                                    if (response.status === 1006 || response.status === 1007 || response.status === 1008) {
                                        //Aqui bloqueamos la localizacion
                                        SiriusService.bloquearLocalizacion(vinRequest).then(response => {
                                            console.log("RESPUESTA EN EL CONTROLLER [bloquearLocalizacion]: " + JSON.stringify(response));

                                            if (!response.error) {
                                                var svcReqId = response.svcReqId;

                                                SiriusService.consultaEstatusLocalizacion(vinRequest).then(response => {
                                                    if (response.tracker) {
                                                        mensajeGeneral.addClass('alert alert-success');
                                                        mensajeGeneral.text('El bloqueo de localización del vehículo con el vin ' + vin + ' se realizó conexito.\n' + JSON.stringify(response.tracker));
                                                        mensajeGeneral.show();
                                                        divMensajeGeneral.show();
                                                        window.scrollTo(0, 0);

                                                        $('#Searching_Modal').modal('hide');

                                                    } else {
                                                        mensajeGeneral.addClass('alert alert-danger');
                                                        mensajeGeneral.text('Ocurrió un problema al bloquear la localización del vehículo con el vin ' + vin + '.\n' + 'Error: ' + response.status + ' ' + response.message);
                                                        mensajeGeneral.show();
                                                        divMensajeGeneral.show();
                                                        window.scrollTo(0, 0);

                                                        $('#Searching_Modal').modal('hide');
                                                    }
                                                });


                                            } else {
                                                mensajeGeneral.addClass('alert alert-danger');
                                                mensajeGeneral.text('Ocurrió un problema al bloquear la localización del vehículo con el vin ' + vin + '.\n' + 'Error: ' + response.status + ' ' + response.message);
                                                mensajeGeneral.show();
                                                divMensajeGeneral.show();
                                                window.scrollTo(0, 0);

                                                $('#Searching_Modal').modal('hide');
                                            }
                                        });

                                    } else {
                                        mensajeGeneral.addClass('alert alert-danger');

                                        if (response.status === 1004) {
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

        if (esCorrecto) {
            $('#Searching_Modal').modal('show');

            //Consultamos el token SXMIDMLogin
            SiriusService.consultaTokenSXMIDMLogin().then(response => {
                console.log("RESPUESTA EN EL CONTROLLER [consultaTokenSXMIDMLogin]: " + JSON.stringify(response));

                if (!response.error) {
                    var tokenSXMIDMLogin = response.token;

                    //Consultamos el token SXMCloud
                    SiriusService.consultaTokenSXMCloud().then(response => {
                        console.log("RESPUESTA EN EL CONTROLLER [consultaTokenSXMCloud]: " + JSON.stringify(response));

                        if (!response.error) {
                            var tokenSXMCloud = response.token;

                            var vinRequest = {};
                            vinRequest.tokenSXMIDMLogin = tokenSXMIDMLogin;
                            vinRequest.tokenSXMCloud = tokenSXMCloud;
                            vinRequest.vin = vin;

                            //sleep(2000);
                            SiriusService.consultaEstatusLocalizacion(vinRequest).then(response => {
                                console.log("RESPUESTA EN EL CONTROLLER [consultaEstatusLocalizacion]: " + JSON.stringify(response));

                                if (!response.error) {
                                    if (response.status === 1005) {
                                        mensajeGeneral.addClass('alert alert-danger');
                                        mensajeGeneral.text(response.status + ' ' + response.message);
                                        mensajeGeneral.show();
                                        divMensajeGeneral.show();
                                        window.scrollTo(0, 0);

                                        $('#Searching_Modal').modal('hide');
                                    }

                                } else {

                                    if (response.status === 1006 || response.status === 1007 || response.status === 1008) {
                                        //Aqui cancelamos la localizacion
                                        SiriusService.cancelarLocalizacion(vinRequest).then(response => {
                                            console.log("RESPUESTA EN EL CONTROLLER [cancelarLocalizacion]: " + JSON.stringify(response));

                                            if (!response.error) {
                                                var svcReqId = response.svcReqId;

                                                SiriusService.consultaEstatusLocalizacion(vinRequest).then(response => {
                                                    if (response.tracker) {
                                                        mensajeGeneral.addClass('alert alert-danger');
                                                        mensajeGeneral.text('Ocurrió un problema al cancelar la localización del vehículo con el vin ' + vin + '.\n' + 'Error: ' + response.status + ' ' + response.message);
                                                        mensajeGeneral.show();
                                                        divMensajeGeneral.show();
                                                        window.scrollTo(0, 0);

                                                        $('#Searching_Modal').modal('hide');
                                                    } else {
                                                        mensajeGeneral.addClass('alert alert-success');
                                                        mensajeGeneral.text('La cancelación de localización del vehículo con el vin ' + vin + ' se realizó conexito.');
                                                        mensajeGeneral.show();
                                                        divMensajeGeneral.show();
                                                        window.scrollTo(0, 0);

                                                        $('#Searching_Modal').modal('hide');
                                                    }
                                                });


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

                                        if (response.status === 1004) {
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

    $scope.aplazarLocalizacion = function () {
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

        if (esCorrecto) {
            $('#Searching_Modal').modal('show');

            //Consultamos el token SXMIDMLogin
            SiriusService.consultaTokenSXMIDMLogin().then(response => {
                console.log("RESPUESTA EN EL CONTROLLER [consultaTokenSXMIDMLogin]: " + JSON.stringify(response));

                if (!response.error) {
                    var tokenSXMIDMLogin = response.token;

                    //Consultamos el token SXMCloud
                    SiriusService.consultaTokenSXMCloud().then(response => {
                        console.log("RESPUESTA EN EL CONTROLLER [consultaTokenSXMCloud]: " + JSON.stringify(response));

                        if (!response.error) {
                            var tokenSXMCloud = response.token;

                            var vinRequest = {};
                            vinRequest.tokenSXMIDMLogin = tokenSXMIDMLogin;
                            vinRequest.tokenSXMCloud = tokenSXMCloud;
                            vinRequest.vin = vin;

                            //sleep(2000);
                            SiriusService.consultaEstatusLocalizacion(vinRequest).then(response => {
                                console.log("RESPUESTA EN EL CONTROLLER [consultaEstatusLocalizacion]: " + JSON.stringify(response));

                                if (!response.error) {
                                    if (response.status === 1005) {
                                        mensajeGeneral.addClass('alert alert-danger');
                                        mensajeGeneral.text(response.status + ' ' + response.message);
                                        mensajeGeneral.show();
                                        divMensajeGeneral.show();
                                        window.scrollTo(0, 0);

                                        $('#Searching_Modal').modal('hide');
                                    }

                                } else {

                                    if (response.status === 1006 || response.status === 1007 || response.status === 1008) {
                                        //Aqui aplazamos la localizacion
                                        SiriusService.aplazarLocalizacion(vinRequest).then(response => {
                                            console.log("RESPUESTA EN EL CONTROLLER [aplazarLocalizacion]: " + JSON.stringify(response));

                                            if (!response.error) {
                                                var svcReqId = response.svcReqId;

                                                SiriusService.consultaEstatusLocalizacion(vinRequest).then(response => {
                                                    if (response.tracker) {
                                                        mensajeGeneral.addClass('alert alert-danger');
                                                        mensajeGeneral.text('Ocurrió un problema al aplazar la localización del vehículo con el vin ' + vin + '.\n' + 'Error: ' + response.status + ' ' + response.message);
                                                        mensajeGeneral.show();
                                                        divMensajeGeneral.show();
                                                        window.scrollTo(0, 0);

                                                        $('#Searching_Modal').modal('hide');
                                                    } else {
                                                        mensajeGeneral.addClass('alert alert-success');
                                                        mensajeGeneral.text('El aplazamiento de localización del vehículo con el vin ' + vin + ' se realizó conexito.');
                                                        mensajeGeneral.show();
                                                        divMensajeGeneral.show();
                                                        window.scrollTo(0, 0);

                                                        $('#Searching_Modal').modal('hide');
                                                    }
                                                });


                                            } else {
                                                mensajeGeneral.addClass('alert alert-danger');
                                                mensajeGeneral.text('Ocurrió un problema al aplazar la localización del vehículo con el vin ' + vin + '.\n' + 'Error: ' + response.status + ' ' + response.message);
                                                mensajeGeneral.show();
                                                divMensajeGeneral.show();
                                                window.scrollTo(0, 0);

                                                $('#Searching_Modal').modal('hide');
                                            }
                                        });

                                    } else {
                                        mensajeGeneral.addClass('alert alert-danger');

                                        if (response.status === 1004) {
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



