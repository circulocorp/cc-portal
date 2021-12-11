var app = angular.module('ccportal', ['ngTable']);

//Sirius Controller
app.controller('SiriusController', function($scope, NgTableParams, $http, SiriusService) {

    $scope.usuarioSesion = new Object();
    $scope.cliente = {};
    $scope.listaClientes = [];
    $scope.clienteSeleccionado = {};
    $scope.vehiculos = [];
    $scope.vehiculoSeleccionado = {};
    $scope.numeroVin = "";

    $scope.tenans = [];
    $scope.tenan = {};

    $scope.consultarTenans = function() {
        //$('#Loading_Modal').modal('show');
        $('#mensajeGeneral').removeClass('alert alert-danger');
        $('#mensajeGeneral').text('');
        $('#mensajeGeneral').hide();
        $('#divMensajeGeneral').hide();

        var mensajeGeneral = $('#mensajeGeneral');
        var divMensajeGeneral = $('#divMensajeGeneral');

        SiriusService.consultaTenans().then(response => {
            console.log("RESPUESTA EN EL CONTROLLER [consultaTenans]: " + JSON.stringify(response));

            if (!response.error) {
                tenans = response.tenans;

                var ele = document.getElementById('select-tenan');
                ele.innerHTML = ele.innerHTML + '<option value="0">SELECCIONE ...</option>';
                for (var i = 0; i < tenans.length; i++) {
                    ele.innerHTML = ele.innerHTML + '<option value="' + tenans[i]['tenan_id'] + '">' + tenans[i]['tenan_id'].toUpperCase() + '</option>';
                }

                $('#Loading_Modal').modal('hide');
            } else {
                mensajeGeneral.addClass('alert alert-danger');
                mensajeGeneral.text('Ocurrio un problema al consultar los tenans o tipo de cliente.\n' + response.status + ': ' + response.message);

                mensajeGeneral.show();
                divMensajeGeneral.show();
                window.scrollTo(0, 0);

                $('#Loading_Modal').modal('hide');
            }

        });
    };

    seleccionarTenan = function(ele) {
        $('#select-tenan').removeClass('is-invalid');
        $('#nombre').removeClass('is-invalid');
        $('#apellido').removeClass('is-invalid');
        $('#email').removeClass('is-invalid');
        $('#mensaje').removeClass('invalid-feedback');

        $('#nombre').removeClass('is-valid');
        $('#nombre').text('');
        $('#apellido').removeClass('is-valid');
        $('#apellido').text('');
        $('#email').removeClass('is-valid');
        $('#email').text('');
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



        var mensajeGeneral = $('#mensajeGeneral');
        var divMensajeGeneral = $('#divMensajeGeneral');

        console.log(ele.options[ele.selectedIndex].text);
        let opcion = ele.options[ele.selectedIndex].text;

        if (opcion == 'SELECCIONE ...') {
            mensajeGeneral.addClass('alert alert-danger');
            mensajeGeneral.text('Seleccione un valor valido.');
            mensajeGeneral.show();
            divMensajeGeneral.show();
            window.scrollTo(0, 0);
        } else {
            $scope.tenan.tenan_id = opcion.toLowerCase();
            console.log('OPCION SELECCIONADA: ' + $scope.tenan.tenan_id);

        }
    };


    $scope.consultarCliente = function() {

        $('#select-tenan').removeClass('is-invalid');
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

        var tenan_id = $scope.tenan.tenan_id;
        var nombre = $scope.cliente.nombre;
        var apellido = $scope.cliente.apellido;
        var email = $scope.cliente.email;

        var mensaje = $('#mensaje');
        var mensajeGeneral = $('#mensajeGeneral');
        var divMensajeGeneral = $('#divMensajeGeneral');
        var esCorrecto = true;

        var busqueda = "";

        console.log("TENAN SELECCIONADO: " + tenan_id);
        if (tenan_id == null || tenan_id == '' || tenan_id == 'undefined' || tenan_id == 'SELECCIONE ...') {
            $('#select-tenan').addClass('is-invalid');

            mensaje.addClass('invalid-feedback');
            mensaje.text('¡Seleccione el Tipo de Cliente (tenan_id) para la búsqueda!');
            mensaje.show();
            return;
        }

        if ((nombre === null || nombre === '' || typeof(nombre) === 'undefined') && (apellido === null || apellido === '' || typeof(apellido) === 'undefined') && (email === null || email === '' || typeof(email) === 'undefined')) {
            $scope.cliente = {};

            $('#nombre').addClass('is-invalid');
            $('#apellido').addClass('is-invalid');
            $('#email').addClass('is-invalid');

            mensaje.addClass('invalid-feedback');
            mensaje.text('¡Debe ingresar el menos un dato de búsqueda!');
            mensaje.show();

            esCorrecto = false;
        } else {

            if (email !== null && email !== '' && typeof(email) !== 'undefined') {

                if (!validarEmail(email)) {
                    $('#email').addClass('is-invalid');

                    mensaje.addClass('invalid-feedback');
                    mensaje.text('¡El email no tiene el formato correcto!');
                    mensaje.show();

                    $('#Loading_Modal').modal('hide');

                    esCorrecto = false;
                }
            }
        }

        if ((nombre !== null && nombre !== '' && typeof(nombre) !== 'undefined')) {
            busqueda += "NOMBRE: " + nombre;
        }
        if ((apellido !== null && apellido !== '' && typeof(apellido) !== 'undefined')) {
            busqueda += ", APELLIDO: " + apellido;
        }
        if ((email !== null && email !== '' && typeof(email) !== 'undefined')) {
            busqueda += ", EMAIL: " + email;
        }

        console.log("CONSULTA: " + busqueda);

        if (esCorrecto) {
            $('#Loading_Modal').modal('show');

            //Consultamos el token SXMIDMLogin            
            console.log("TENAN EN EL CONTROLLER: " + JSON.stringify($scope.tenan));
            SiriusService.consultaTokenSXMCloud($scope.tenan).then(response => {
                console.log("RESPUESTA EN EL CONTROLLER [consultaTokenSXMIDMLogin]: " + JSON.stringify(response));

                if (!response.error) {

                    //Consultamos el cliente
                    $scope.cliente.token = response.token;
                    $scope.cliente.tenan = $scope.tenan.tenan_id;

                    console.log("CLIENTE: " + JSON.stringify($scope.cliente));
                    SiriusService.consultaCliente($scope.cliente).then(response => {
                        console.log("RESPUESTA EN EL CONTROLLER [consultaCliente]: " + JSON.stringify(response));

                        if (!response.error) {
                            $scope.listaClientes = response.lista;

                            $scope.tableParams = new NgTableParams({}, { dataset: $scope.listaClientes });
                            $scope.tableParams.reload();

                            $('#tblClientes').show();
                            $('#Loading_Modal').modal('hide');

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

                            $('#Loading_Modal').modal('hide');
                        }

                        var systemEvent = new Object();
                        systemEvent.date = moment().format('YYYY/MM/DD HH:mm:ss');
                        systemEvent.userEmail = $scope.usuarioSesion.user;
                        systemEvent.userName = $scope.usuarioSesion.first_names + " " + $scope.usuarioSesion.last_names;
                        systemEvent.action = "CONSULTAR CLIENTE";
                        systemEvent.observation = "El usuario " + $scope.usuarioSesion.user + " consulto al cliente con los parametros: " + busqueda;

                        SiriusService.saveSystemEvents(systemEvent).then(response => {

                        });

                    });


                } else {
                    mensajeGeneral.addClass('alert alert-danger');
                    mensajeGeneral.text('Ocurrio un problema la obtener el token SXM-IDM-Login.\n' + 'Error: ' + response.status + ' ' + response.message);
                    mensajeGeneral.show();
                    divMensajeGeneral.show();
                    window.scrollTo(0, 0);

                    $('#Loading_Modal').modal('hide');
                }

            });

        }

    };

    $scope.seleccionarCliente = function(data) {
        $scope.clienteSeleccionado = {};
        $scope.vehiculos = [];
        $scope.vehiculosConVehicleId = [];
        $scope.vehiculoSeleccionado = {};
        $scope.vehicle_id = "";

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

        $('#vin').attr('disabled', 'disabled');
        $('#btnConsultar').attr('disabled', 'disabled');
        $('#btnActivar').attr('disabled', 'disabled');
        $('#btnBloquear').attr('disabled', 'disabled');
        $('#btnAplazar').attr('disabled', 'disabled');
        $('#btnCancelar').attr('disabled', 'disabled');
        $('#btnActualizar').attr('disabled', 'disabled');


        $scope.listaClientes.forEach(function(valor, indice, array) {

            if (!valor.isSelected && data === valor) {

                valor.isSelected = true;

                console.log("DATA: " + JSON.stringify(data));

                $scope.clienteSeleccionado = data;

                console.log("CLIENTE: " + JSON.stringify($scope.clienteSeleccionado));

                $scope.vehiculos = $scope.clienteSeleccionado.effectiveRoles;

                console.log("VEHICULOS: " + JSON.stringify($scope.vehiculos));

                //QUITAR ESTA LINEA AL TENER DATOS REALES
                //if ($scope.vehiculos == null || $scope.vehiculos == 'undefined' || $scope.vehiculos.length == 0) {
                //    var vehiculo = { "vin": "NS000095074405420", "makeName": "NISSAN", "modelName": "SENTRA", "modelYear": "2021", "exteriorColor": "RED", "status": "ACTIVE" };
                //    $scope.vehiculos.push(vehiculo);
                //}

                if (typeof($scope.vehiculos) !== 'undefined' && $scope.vehiculos !== null && $scope.vehiculos.length !== null && $scope.vehiculos.length > 0) {


                    //Con esta funcion s eobtienen la lista de vehicleId asignados al vehiculo
                    var listaVehiclesIds = [];
                    $scope.vehiculos.forEach(function(valor, indice, array) {
                        if (valor.refProperties.hasOwnProperty('roleType')) {
                            if (valor.refProperties.roleType === 'PRIMARY_SUBSCRIBER') {
                                if (valor.refProperties.hasOwnProperty('vehicleId')) {
                                    if (Array.isArray(valor.refProperties.vehicleId)) {
                                        listaVehiclesIds = valor.refProperties.vehicleId;
                                        //Aqui asigno la lista de vehicleId que se encontraron
                                        return true;
                                    }
                                }
                            }
                        }
                    });

                    console.log("LISTA DE VEHICLES IDS: " + listaVehiclesIds);

                    if (listaVehiclesIds !== null && listaVehiclesIds !== 'undefined' && listaVehiclesIds.length > 0) {


                        if (Array.isArray(listaVehiclesIds)) {
                            listaVehiclesIds.forEach(function(valorVehicleId, indice, array) {
                                console.log("VEHICLE ID: " + valorVehicleId);

                                var vehiculo = {};
                                vehiculo.vehicle_id = valorVehicleId;
                                vehiculo.tenant_id = $scope.cliente.tenan;
                                vehiculo.access_token = $scope.cliente.token;

                                SiriusService.consultarDetalleVehiculo(vehiculo).then(response => {
                                    console.log("RESPUESTA EN EL CONTROLLER [consultarDetalleVehiculo]: " + JSON.stringify(response));

                                    if (!response.error) {
                                        vehiculo.isSelected = false;
                                        vehiculo.make = response.detalle_vehiculo.make;
                                        vehiculo.model = response.detalle_vehiculo.model;
                                        vehiculo.year = response.detalle_vehiculo.year;
                                        vehiculo.color = response.detalle_vehiculo.color;
                                        vehiculo.transmissionType = response.detalle_vehiculo.transmissionType;
                                        vehiculo.active = response.detalle_vehiculo.active;
                                        vehiculo.tenantId = response.detalle_vehiculo.tenantId;
                                        vehiculo.vin = response.detalle_vehiculo.vin;

                                        console.log("VEHICULO: " + JSON.stringify(vehiculo));
                                        $scope.vehiculosConVehicleId.push(vehiculo);
                                        console.log("LISTA DE VEHICULOS: " + JSON.stringify($scope.vehiculosConVehicleId));

                                        $scope.tableParamsVeviculos = new NgTableParams({ filter: {} }, { dataset: $scope.vehiculosConVehicleId });
                                        $scope.tableParams.reload();
                                    } else {

                                        mensajeGeneral.addClass('alert alert-danger');
                                        mensajeGeneral.text('Ocurrio un problema al consultar el detalle del vehiculo.\n' + 'Error: ' + response.status + ' ' + response.message);

                                        mensajeGeneral.show();
                                        divMensajeGeneral.show();
                                        window.scrollTo(0, 0);

                                    }

                                    var systemEvent = new Object();
                                    systemEvent.date = moment().format('YYYY/MM/DD HH:mm:ss');
                                    systemEvent.userEmail = $scope.usuarioSesion.user;
                                    systemEvent.userName = $scope.usuarioSesion.first_names + " " + $scope.usuarioSesion.last_names;
                                    systemEvent.action = "CONSULTAR DETALLE DE VEHICULO";
                                    systemEvent.observation = "El usuario " + $scope.usuarioSesion.user + " consulto el detalle del vehiculo con los parametros: vehicleid = " + vehiculo.vehicle_Id + " y tenanid = " + vehiculo.tenant_id;

                                    SiriusService.saveSystemEvents(systemEvent).then(response => {

                                    });

                                });

                            });
                        }

                        $scope.tableParamsVeviculos = new NgTableParams({ filter: {} }, { dataset: $scope.vehiculosConVehicleId });
                        $scope.tableParams.reload();

                        $('#tblVehiculos').show();
                        $('#divAcciones').show();

                    } else {
                        mensajeGeneral.addClass('alert alert-danger');
                        mensajeGeneral.text('Los vehículos asignados al cliente seleccionado, NO cuentan con el valor = vehicleId,  para su procesamiento');
                        mensajeGeneral.show();
                        divMensajeGeneral.show();
                        window.scrollTo(0, 0);
                    }

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

        $scope.tableParams = new NgTableParams({ filter: {} }, { dataset: $scope.listaClientes });
    };

    $scope.seleccionarVehiculo = function(data) {
        $scope.vehiculoSeleccionado = {};

        $('#mensajeGeneral').removeClass('alert alert-danger');
        $('#mensajeGeneral').text('');
        $('#mensajeGeneral').hide();
        $('#divMensajeGeneral').hide();

        //var mensaje = $('#mensaje');
        var mensajeGeneral = $('#mensajeGeneral');
        var divMensajeGeneral = $('#divMensajeGeneral');

        $('#vin').removeClass('is-invalid');
        $('#vin').removeClass('is-valid');

        $('#mensajeVin').removeClass('invalid-feedback');
        $('#mensajeVin').removeClass('valid-feedback');
        $('#mensajeVin').text('');
        $('#mensajeVin').hide();

        $scope.vehiculosConVehicleId.forEach(function(valor, indice, array) {

            console.log("VALOR: " + JSON.stringify(valor));
            console.log("DATA: " + JSON.stringify(data));
            console.log("IS SELECTED: " + valor.isSelected);
            console.log("DATA VIN: " + data.vin);
            console.log("VALOR VIN: " + valor.vin);

            if (!valor.isSelected && data.vin === valor.vin) {
                $scope.vehiculoSeleccionado = data;
                $scope.vehiculoSeleccionado.isSelected = true;

                if ($scope.vehiculoSeleccionado.vehicle_id === "SIN VEHICLE ID") {
                    $('#btnConsultar').attr('disabled', 'disabled');
                    $('#btnActivar').attr('disabled', 'disabled');
                    $('#btnBloquear').attr('disabled', 'disabled');
                    $('#btnAplazar').attr('disabled', 'disabled');
                    $('#btnCancelar').attr('disabled', 'disabled');
                    $('#btnActualizar').attr('disabled', 'disabled');

                    mensajeGeneral.addClass('alert alert-danger');
                    mensajeGeneral.text('El vehiculo seleccionado no cuenta con un vehicleid asignado');

                    mensajeGeneral.show();
                    divMensajeGeneral.show();
                    window.scrollTo(0, 0);

                } else {
                    $('#btnConsultar').removeAttr('disabled', 'disabled');
                    $('#btnActivar').removeAttr('disabled', 'disabled');
                    $('#btnBloquear').removeAttr('disabled', 'disabled');
                    $('#btnAplazar').removeAttr('disabled', 'disabled');
                    $('#btnCancelar').removeAttr('disabled', 'disabled');
                    $('#btnActualizar').removeAttr('disabled', 'disabled');

                    console.log("VEHICULO SELECCIONADO: " + JSON.stringify($scope.vehiculoSeleccionado));


                    SiriusService.consultarVehiculosSinBloqueo($scope.vehiculoSeleccionado).then(response => {
                        console.log("RESPUESTA EN EL CONTROLLER [consultarVehiculosSinBloqueo]: " + JSON.stringify(response));


                        if (response.vehiculos_sin_bloqueo != null && response.vehiculos_sin_bloqueo != undefined) {
                            //alert("El Vehículo con Marca: " + response.vehiculos_sin_bloqueo[0].marca + ", Modelo: " + response.vehiculos_sin_bloqueo[0].modelo + ", Año: " + response.vehiculos_sin_bloqueo[0].anio + ", no se puede bloquear temporalmente");
                            $('#btnBloquear').attr('disabled', 'disabled');

                            mensajeGeneral.addClass('alert alert-danger');
                            mensajeGeneral.text("El Vehículo con Marca: " + response.vehiculos_sin_bloqueo[0].marca + ", Modelo: " + response.vehiculos_sin_bloqueo[0].modelo + ", Año: " + response.vehiculos_sin_bloqueo[0].anio + ", no se puede bloquear temporalmente");

                            mensajeGeneral.show();
                            divMensajeGeneral.show();
                            window.scrollTo(0, 0);
                        } else {
                            $('#btnBloquear').removeAttr('disabled', 'disabled');
                        }


                    });
                }


                return true;
            } else {
                valor.isSelected = false;
                //$scope.vehiculoSeleccionado = {};
            }
        });

    };

    $scope.consultarLocalizacion = function() {
        //$scope.token_sxm_idm_login = {};
        //$scope.token_sxm_cloud = {};

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
        vin = $('#vin').val();
        var mensajeVin = $('#mensajeVin');
        var mensajeGeneral = $('#mensajeGeneral');
        var divMensajeGeneral = $('#divMensajeGeneral');

        var esCorrecto = true;

        if (vin === null || vin === '' || typeof(vin) === 'undefined') {

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
            $('#Loading_Modal').modal('show');

            var systemEvent = new Object();
            systemEvent.date = moment().format('YYYY/MM/DD HH:mm:ss');
            systemEvent.userEmail = $scope.usuarioSesion.user;
            systemEvent.userName = $scope.usuarioSesion.first_names + " " + $scope.usuarioSesion.last_names;
            systemEvent.action = "CONSULTAR LOCALIZACION";

            var request = {};
            request.access_token = $scope.cliente.token;
            request.vin = vin;
            request.vehicle_id = $scope.vehiculoSeleccionado.vehicle_id;

            SiriusService.consultaEstatusLocalizacion(request).then(response => {
                console.log("RESPUESTA EN EL CONTROLLER [consultaEstatusLocalizacion]: " + JSON.stringify(response));

                if (!response.error) {

                    mensajeGeneral.addClass('alert alert-success');
                    mensajeGeneral.text(response.message);
                    mensajeGeneral.show();
                    divMensajeGeneral.show();
                    window.scrollTo(0, 0);

                    systemEvent.observation = "El usuario " + $scope.usuarioSesion.user + " consulto la localización del VIN: " + request.vin + "\n" + mensajeGeneral.text();
                    SiriusService.saveSystemEvents(systemEvent).then(response => {});

                    $('#Loading_Modal').modal('hide');

                } else {
                    mensajeGeneral.addClass('alert alert-danger');

                    if (response.status === 1004 || response.status === 1005 || response.status === 1006 || response.status === 1007 || response.status === 1008 || response.status === 1009 || response.status === 1010) {
                        mensajeGeneral.text(response.message);
                    } else {
                        mensajeGeneral.text('Ocurrió un problema al consultar el estatus del vehículo.\n' + 'Error: ' + response.status + ' ' + response.message);
                    }

                    mensajeGeneral.show();
                    divMensajeGeneral.show();
                    window.scrollTo(0, 0);

                    systemEvent.observation = "El usuario " + $scope.usuarioSesion.user + " consulto la localización del VIN: " + request.vin + "\n" + mensajeGeneral.text();
                    SiriusService.saveSystemEvents(systemEvent).then(response => {});

                    $('#Loading_Modal').modal('hide');
                }

            });

        }

    };

    $scope.activarLocalizacion = function() {
        //$scope.token_sxm_idm_login = {};
        //$scope.token_sxm_cloud = {};

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

        if (vin === null || vin === '' || typeof(vin) === 'undefined') {

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
            $('#Loading_Modal').modal('show');

            var systemEvent = new Object();
            systemEvent.date = moment().format('YYYY/MM/DD HH:mm:ss');
            systemEvent.userEmail = $scope.usuarioSesion.user;
            systemEvent.userName = $scope.usuarioSesion.first_names + " " + $scope.usuarioSesion.last_names;
            systemEvent.action = "ACTIVAR LOCALIZACION";


            var request = {};
            request.access_token = $scope.cliente.token;
            request.vin = vin;
            request.vehicle_id = $scope.vehiculoSeleccionado.vehicle_id;
            request.sessionId = generateUUID();
            request.correlationId = generateUUID();

            SiriusService.consultaEstatusLocalizacion(request).then(responseEstatusLocalizacion => {
                console.log("RESPUESTA EN EL CONTROLLER [activarLocalizacion/consultaEstatusLocalizacion]: " + JSON.stringify(responseEstatusLocalizacion));

                if (!responseEstatusLocalizacion.error) {

                    if (responseEstatusLocalizacion.status === 1005) {
                        //Aqui activamos la localizacion
                        SiriusService.activarLocalizacion(request).then(responseActivarLocalizacion => {
                            console.log("RESPUESTA EN EL CONTROLLER [activarLocalizacion/activarLocalizacion]: " + JSON.stringify(responseActivarLocalizacion));

                            if (!responseActivarLocalizacion.error) {
                                var svcReqId = responseActivarLocalizacion.svcReqId;

                                mensajeGeneral.addClass('alert alert-success');
                                mensajeGeneral.text('La activación de localización del vehículo con el vin ' + request.vin + ' se realizó con exito.');
                                mensajeGeneral.show();
                                divMensajeGeneral.show();
                                window.scrollTo(0, 0);

                                systemEvent.observation = "El usuario " + $scope.usuarioSesion.user + " activo la localización del VIN: " + request.vin + "\nRESPUESTA: " + mensajeGeneral.text();
                                SiriusService.saveSystemEvents(systemEvent).then(response => {});

                                $('#Loading_Modal').modal('hide');

                            } else {
                                mensajeGeneral.addClass('alert alert-danger');
                                mensajeGeneral.text('Error: ' + responseActivarLocalizacion.status + ' ' + responseActivarLocalizacion.message);
                                mensajeGeneral.show();
                                divMensajeGeneral.show();
                                window.scrollTo(0, 0);

                                systemEvent.observation = "El usuario " + $scope.usuarioSesion.user + " activo la localización del VIN: " + request.vin + "\nRESPUESTA: " + mensajeGeneral.text();
                                SiriusService.saveSystemEvents(systemEvent).then(response => {});

                                $('#Loading_Modal').modal('hide');
                            }
                        });

                    } else {
                        mensajeGeneral.addClass('alert alert-danger');
                        mensajeGeneral.text('Error: ' + responseEstatusLocalizacion.status + ' ' + responseEstatusLocalizacion.message);
                        mensajeGeneral.show();
                        divMensajeGeneral.show();
                        window.scrollTo(0, 0);

                        systemEvent.observation = "El usuario " + $scope.usuarioSesion.user + " activo la localización del VIN: " + request.vin + "\nRESPUESTA: " + mensajeGeneral.text();
                        SiriusService.saveSystemEvents(systemEvent).then(response => {});

                        $('#Loading_Modal').modal('hide');
                    }

                } else {

                    if (responseEstatusLocalizacion.status === 1004 || responseEstatusLocalizacion.status === 1006 || responseEstatusLocalizacion.status === 1007 || responseEstatusLocalizacion.status === 1008 || responseEstatusLocalizacion.status === 1009 || responseEstatusLocalizacion.status === 1010) {
                        mensajeGeneral.text(responseEstatusLocalizacion.message + "\nNo se puede volver activar la localización.");
                    } else {
                        mensajeGeneral.text(responseEstatusLocalizacion.message);
                    }

                    mensajeGeneral.addClass('alert alert-danger');
                    mensajeGeneral.show();
                    divMensajeGeneral.show();
                    window.scrollTo(0, 0);

                    systemEvent.observation = "El usuario " + $scope.usuarioSesion.user + " activo la localización del VIN: " + request.vin + "\nRESPUESTA: " + mensajeGeneral.text();
                    SiriusService.saveSystemEvents(systemEvent).then(response => {});

                    $('#Loading_Modal').modal('hide');
                }

            });

        }

    };

    $scope.activarBloqueo = function() {
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

        if (vin === null || vin === '' || typeof(vin) === 'undefined') {

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
            $('#Loading_Modal').modal('show');

            var systemEvent = new Object();
            systemEvent.date = moment().format('YYYY/MM/DD HH:mm:ss');
            systemEvent.userEmail = $scope.usuarioSesion.user;
            systemEvent.userName = $scope.usuarioSesion.first_names + " " + $scope.usuarioSesion.last_names;
            systemEvent.action = "ACTIVAR BLOQUE0";

            var request = {};
            request.access_token = $scope.cliente.token;
            request.vin = vin;
            request.vehicle_id = $scope.vehiculoSeleccionado.vehicle_id;

            //sleep(2000);
            SiriusService.consultaEstatusLocalizacion(request).then(response => {
                console.log("RESPUESTA EN EL CONTROLLER [consultaEstatusLocalizacion]: " + JSON.stringify(response));

                if (!response.error) {
                    if (response.status === 1005) {
                        mensajeGeneral.addClass('alert alert-danger');
                        mensajeGeneral.text(response.message);
                        mensajeGeneral.show();
                        divMensajeGeneral.show();
                        window.scrollTo(0, 0);

                        systemEvent.observation = "El usuario " + $scope.usuarioSesion.user + " activo el bloqueo del VIN: " + request.vin + "\nRESPUESTA: " + mensajeGeneral.text();
                        SiriusService.saveSystemEvents(systemEvent).then(response => {});

                        $('#Loading_Modal').modal('hide');
                    }

                } else {

                    if (response.status === 1006) {
                        //Aqui bloqueamos la localizacion
                        SiriusService.bloquearLocalizacion(request).then(response => {
                            console.log("RESPUESTA EN EL CONTROLLER [bloquearLocalizacion]: " + JSON.stringify(response));

                            if (!response.error) {
                                var svcReqId = response.svcReqId;

                                mensajeGeneral.addClass('alert alert-success');
                                mensajeGeneral.text('El bloqueo de la localización del vehículo con el vin ' + vin + ' se realizó con exito.');
                                mensajeGeneral.show();
                                divMensajeGeneral.show();
                                window.scrollTo(0, 0);

                                systemEvent.observation = "El usuario " + $scope.usuarioSesion.user + " activo el bloqueo del VIN: " + request.vin + "\nRESPUESTA: " + mensajeGeneral.text();
                                SiriusService.saveSystemEvents(systemEvent).then(response => {});

                                $('#Loading_Modal').modal('hide');

                            } else {
                                mensajeGeneral.addClass('alert alert-danger');
                                mensajeGeneral.text(response.message);
                                mensajeGeneral.show();
                                divMensajeGeneral.show();
                                window.scrollTo(0, 0);

                                systemEvent.observation = "El usuario " + $scope.usuarioSesion.user + " activo el bloqueo del VIN: " + request.vin + "\nRESPUESTA: " + mensajeGeneral.text();
                                SiriusService.saveSystemEvents(systemEvent).then(response => {});

                                $('#Loading_Modal').modal('hide');
                            }
                        });
                    } else {
                        if (response.status === 1007 || response.status === 1008 || response.status === 1009 || response.status === 1010) {
                            mensajeGeneral.addClass('alert alert-danger');
                            mensajeGeneral.text(response.message + "\n No se puede realizar el bloqueo de la localización.");
                            mensajeGeneral.show();
                            divMensajeGeneral.show();
                            window.scrollTo(0, 0);

                            systemEvent.observation = "El usuario " + $scope.usuarioSesion.user + " bloqueo la localización del VIN: " + request.vin + "\nRESPUESTA: " + mensajeGeneral.text();
                            SiriusService.saveSystemEvents(systemEvent).then(response => {});

                            $('#Loading_Modal').modal('hide');
                        } else {
                            mensajeGeneral.text(response.message);


                            mensajeGeneral.addClass('alert alert-danger');
                            mensajeGeneral.show();
                            divMensajeGeneral.show();
                            window.scrollTo(0, 0);

                            systemEvent.observation = "El usuario " + $scope.usuarioSesion.user + " bloqueo la localización del VIN: " + request.vin + "\nRESPUESTA: " + mensajeGeneral.text();
                            SiriusService.saveSystemEvents(systemEvent).then(response => {});

                            $('#Loading_Modal').modal('hide');
                        }

                    }

                }
            });




        }

    };

    $scope.cancelarLocalizacion = function() {
        //$scope.token_sxm_idm_login = {};
        //$scope.token_sxm_cloud = {};

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

        if (vin === null || vin === '' || typeof(vin) === 'undefined') {

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
            $('#Loading_Modal').modal('show');

            var systemEvent = new Object();
            systemEvent.date = moment().format('YYYY/MM/DD HH:mm:ss');
            systemEvent.userEmail = $scope.usuarioSesion.user;
            systemEvent.userName = $scope.usuarioSesion.first_names + " " + $scope.usuarioSesion.last_names;
            systemEvent.action = "CANCELAR LOCALIZACION";


            var request = {};
            request.access_token = $scope.cliente.token;
            request.vin = vin;
            request.vehicle_id = $scope.vehiculoSeleccionado.vehicle_id;

            //sleep(2000);
            SiriusService.consultaEstatusLocalizacion(request).then(response => {
                console.log("RESPUESTA EN EL CONTROLLER [cancelarLocalizacion/consultaEstatusLocalizacion]: " + JSON.stringify(response));

                //Eliminar estas lineas al subir a produccion
                //response.error = true;
                //response.status = 1006;

                if (!response.error) {
                    if (response.status === 1005) {
                        mensajeGeneral.addClass('alert alert-danger');
                        mensajeGeneral.text(response.message);
                        mensajeGeneral.show();
                        divMensajeGeneral.show();
                        window.scrollTo(0, 0);

                        systemEvent.observation = "El usuario " + $scope.usuarioSesion.user + " cancelo la localización del VIN: " + request.vin + "\nRESPUESTA: " + mensajeGeneral.text();
                        SiriusService.saveSystemEvents(systemEvent).then(response => {});

                        $('#Loading_Modal').modal('hide');
                    }

                } else {

                    if (response.status === 1006 || response.status === 1009 || response.status === 1010) {
                        //Aqui cancelamos la localizacion
                        SiriusService.cancelarLocalizacion(request).then(response => {
                            console.log("RESPUESTA EN EL CONTROLLER [cancelarLocalizacion/cancelarLocalizacion]: " + JSON.stringify(response));

                            if (!response.error) {
                                var svcReqId = response.svcReqId;

                                mensajeGeneral.addClass('alert alert-success');
                                mensajeGeneral.text('La cancelación de localización del vehículo con el vin ' + request.vin + ' se realizó con exito.');
                                mensajeGeneral.show();
                                divMensajeGeneral.show();
                                window.scrollTo(0, 0);

                                systemEvent.observation = "El usuario " + $scope.usuarioSesion.user + " cancelo la localización del VIN: " + request.vin + "\nRESPUESTA: " + mensajeGeneral.text();
                                SiriusService.saveSystemEvents(systemEvent).then(response => {});

                                $('#Loading_Modal').modal('hide');

                            } else {
                                mensajeGeneral.addClass('alert alert-danger');
                                mensajeGeneral.text(response.message);
                                mensajeGeneral.show();
                                divMensajeGeneral.show();
                                window.scrollTo(0, 0);

                                systemEvent.observation = "El usuario " + $scope.usuarioSesion.user + " cancelo la localización del VIN: " + request.vin + "\nRESPUESTA: " + mensajeGeneral.text();
                                SiriusService.saveSystemEvents(systemEvent).then(response => {});

                                $('#Loading_Modal').modal('hide');
                            }
                        });

                    } else {
                        mensajeGeneral.addClass('alert alert-danger');
                        if (response.status === 1007 || response.status === 1008) {
                            mensajeGeneral.text(response.message + "\n No se puede realizar la cancelación.");
                        } else if (response.status === 1004) {
                            mensajeGeneral.text(response.message);
                        } else {
                            mensajeGeneral.text(response.message);
                        }


                        mensajeGeneral.show();
                        divMensajeGeneral.show();
                        window.scrollTo(0, 0);

                        systemEvent.observation = "El usuario " + $scope.usuarioSesion.user + " cancelo la localización del VIN: " + request.vin + "\nRESPUESTA: " + mensajeGeneral.text();
                        SiriusService.saveSystemEvents(systemEvent).then(response => {});

                        $('#Loading_Modal').modal('hide');
                    }

                }
            });

        }

    };

    $scope.aplazarLocalizacion = function() {
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

        if (vin === null || vin === '' || typeof(vin) === 'undefined') {

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
            $('#Loading_Modal').modal('show');

            var systemEvent = new Object();
            systemEvent.date = moment().format('YYYY/MM/DD HH:mm:ss');
            systemEvent.userEmail = $scope.usuarioSesion.user;
            systemEvent.userName = $scope.usuarioSesion.first_names + " " + $scope.usuarioSesion.last_names;
            systemEvent.action = "APLAZAR LOCALIZACION";



            var request = {};
            request.access_token = $scope.cliente.token;
            request.vin = vin;
            request.vehicle_id = $scope.vehiculoSeleccionado.vehicle_id;

            //sleep(2000);
            SiriusService.consultaEstatusLocalizacion(request).then(response => {
                console.log("RESPUESTA EN EL CONTROLLER [consultaEstatusLocalizacion]: " + JSON.stringify(response));

                if (!response.error) {
                    if (response.status === 1005) {
                        mensajeGeneral.addClass('alert alert-danger');
                        mensajeGeneral.text(response.message);
                        mensajeGeneral.show();
                        divMensajeGeneral.show();
                        window.scrollTo(0, 0);

                        systemEvent.observation = "El usuario " + $scope.usuarioSesion.user + " aplazo la localización del VIN: " + request.vin + "\nRESPUESTA: " + mensajeGeneral.text();
                        SiriusService.saveSystemEvents(systemEvent).then(response => {});

                        $('#Loading_Modal').modal('hide');
                    }

                } else {

                    if (response.status === 1006) {
                        //Aqui aplazamos la localizacion
                        SiriusService.aplazarLocalizacion(request).then(response => {
                            console.log("RESPUESTA EN EL CONTROLLER [aplazarLocalizacion]: " + JSON.stringify(response));

                            if (!response.error) {
                                var svcReqId = response.svcReqId;

                                mensajeGeneral.addClass('alert alert-success');
                                mensajeGeneral.text('El aplazamiento de localización del vehículo con el vin ' + vin + ' se realizó con exito.');
                                mensajeGeneral.show();
                                divMensajeGeneral.show();
                                window.scrollTo(0, 0);

                                systemEvent.observation = "El usuario " + $scope.usuarioSesion.user + " aplazo la localización del VIN: " + request.vin + "\nRESPUESTA: " + mensajeGeneral.text();
                                SiriusService.saveSystemEvents(systemEvent).then(response => {});

                                $('#Loading_Modal').modal('hide');


                            } else {
                                mensajeGeneral.addClass('alert alert-danger');
                                mensajeGeneral.text(response.message);
                                mensajeGeneral.show();
                                divMensajeGeneral.show();
                                window.scrollTo(0, 0);

                                systemEvent.observation = "El usuario " + $scope.usuarioSesion.user + " aplazo la localización del VIN: " + request.vin + "\nRESPUESTA: " + mensajeGeneral.text();
                                SiriusService.saveSystemEvents(systemEvent).then(response => {});

                                $('#Loading_Modal').modal('hide');
                            }
                        });

                    } else {

                        if (response.status === 1007 || response.status === 1008 || response.status === 1009 || response.status === 1010) {
                            mensajeGeneral.addClass('alert alert-danger');
                            mensajeGeneral.text(response.message + "\n No se puede realizar el aplazamiento de la localización.");
                            mensajeGeneral.show();
                            divMensajeGeneral.show();
                            window.scrollTo(0, 0);

                            systemEvent.observation = "El usuario " + $scope.usuarioSesion.user + " aplazo la localización del VIN: " + request.vin + "\nRESPUESTA: " + mensajeGeneral.text();
                            SiriusService.saveSystemEvents(systemEvent).then(response => {});

                            $('#Loading_Modal').modal('hide');
                        } else {
                            mensajeGeneral.text(response.message);


                            mensajeGeneral.addClass('alert alert-danger');
                            mensajeGeneral.show();
                            divMensajeGeneral.show();
                            window.scrollTo(0, 0);

                            systemEvent.observation = "El usuario " + $scope.usuarioSesion.user + " aplazo la localización del VIN: " + request.vin + "\nRESPUESTA: " + mensajeGeneral.text();
                            SiriusService.saveSystemEvents(systemEvent).then(response => {});

                            $('#Loading_Modal').modal('hide');
                        }

                    }

                }
            });

        }
    };

    $scope.actualizarShell = function() {
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

        //        if (vin === null || vin === '' || typeof (vin) === 'undefined') {
        //
        //            $('#vin').addClass('is-invalid');
        //
        //            mensajeVin.addClass('invalid-feedback');
        //            mensajeVin.text('Debe ingresar el número VIN');
        //            mensajeVin.show();
        //
        //            esCorrecto = false;
        //        } else {
        //            if (vin.length !== 17) {
        //                $('#vin').addClass('is-invalid');
        //
        //                mensajeVin.addClass('invalid-feedback');
        //                mensajeVin.text('El numero VIN debe de ser de 17 caracteres');
        //                mensajeVin.show();
        //
        //                esCorrecto = false;
        //            }
        //
        //        }

        if (esCorrecto) {
            $('#Loading_Modal').modal('show');

            var vinRequest = {};
            vinRequest.vin = vin;

            SiriusService.actualizarShell(vinRequest).then(response => {
                console.log("RESPUESTA EN EL CONTROLLER [actualizarShell]: " + JSON.stringify(response));

                if (!response.error) {

                    mensajeGeneral.addClass('alert alert-success');
                    mensajeGeneral.text('La actualización del perfil con el vin ' + vin + ' se realizó con exito.\n' + response.message);
                    mensajeGeneral.show();
                    divMensajeGeneral.show();
                    window.scrollTo(0, 0);

                    $('#Loading_Modal').modal('hide');

                } else {
                    mensajeGeneral.addClass('alert alert-danger');
                    mensajeGeneral.text(response.message);
                    mensajeGeneral.show();
                    divMensajeGeneral.show();
                    window.scrollTo(0, 0);

                    $('#Loading_Modal').modal('hide');
                }
            });



        }

    };

    $scope.getUserSession = function() {
        if (localStorage.getItem('usuarioSession') === null || localStorage.getItem('usuarioSession') === "" || typeof(localStorage.getItem('usuarioSession')) === "undefined") {
            window.location.href = '/login';
        } else {
            var bytes = CryptoJS.AES.decrypt(localStorage.getItem('usuarioSession'), "circulocorp");
            var plaintext = bytes.toString(CryptoJS.enc.Utf8);

            $scope.usuarioSesion = JSON.parse(plaintext);

            if ($scope.usuarioSesion === null || $scope.usuarioSesion === "" || typeof($scope.usuarioSesion) === "undefined") {
                window.location.href = '/login';
            } else {
                //console.log(window.location.href);
            }
        }

    };
});

//Login Controller
app.controller('LoginController', function($scope, NgTableParams, $http, LoginService) {

    $scope.usuario = {};
    $scope.usuarioSesion = new Object();

    $scope.consultarUsuario = function() {

        $('#mensaje').removeClass('alert-primary');
        $('#mensaje').removeClass('alert-secondary');
        $('#mensaje').removeClass('alert-success');
        $('#mensaje').removeClass('alert-danger');
        $('#mensaje').removeClass('alert-warning');
        $('#mensaje').removeClass('alert-info');
        $('#mensaje').removeClass('alert-light');
        $('#mensaje').removeClass('alert-dark');
        $('#mensaje').text('');
        $('#mensaje').hide();

        $('#loading').hide();

        var usuario = $scope.usuario.usuario;
        var password = $scope.usuario.password;
        var mensaje = $('#mensaje');
        var loading = $('#loading');
        var esCorrecto = true;

        if ((usuario === null || usuario === '' || typeof(usuario) === 'undefined')) {

            mensaje.addClass('alert-warning');
            mensaje.text('¡El usuario es requerido!');
            mensaje.show();

            esCorrecto = false;
            return;
        }

        if ((password === null || password === '' || typeof(password) === 'undefined')) {
            mensaje.addClass('alert-warning');
            mensaje.text('¡El password es requerido!');
            mensaje.show();

            esCorrecto = false;
            return;
        }

        if (esCorrecto) {
            $('#Loading_Modal').modal('show');
            loading.show();

            $scope.usuario.password = hex_sha1($scope.usuario.password);

            LoginService.consultarUsuario($scope.usuario).then(response => {

                if (!response.error) {
                    mensaje.addClass('alert-success');
                    mensaje.text(response.message);
                    mensaje.show();

                    $('#Loading_Modal').modal('hide');
                    loading.hide();
                    $(".modal-backdrop").remove();
                    $("#Loading_Modal").remove();

                    $scope.usuario = response.usuario[0];
                    console.log("SESSION: " + JSON.stringify($scope.usuario));
                    console.log("SESSION ENVIROTMEN: " + JSON.stringify(response.environment));

                    $scope.usuario.environment = response.environment;
                    console.log("SESSION ENVIROTMEN: " + JSON.stringify($scope.usuario.environment));

                    var encrypted = CryptoJS.AES.encrypt(JSON.stringify($scope.usuario), "circulocorp");
                    localStorage.setItem('usuarioSession', encrypted);
                    window.location.href = '/index';
                } else {
                    mensaje.addClass('alert-danger');
                    mensaje.text(response.message);
                    mensaje.show();

                    $('#Loading_Modal').modal('hide');
                    loading.hide();
                    $(".modal-backdrop").remove();
                    $("#Loading_Modal").remove();
                }

            });
        }
    };

    $scope.cerrarSesion = function() {

        this.getUserSession();

        var systemEvent = new Object();
        systemEvent.date = moment().format('YYYY/MM/DD HH:mm:ss');
        systemEvent.userEmail = $scope.usuarioSesion.user;
        systemEvent.userName = $scope.usuarioSesion.first_names + " " + $scope.usuarioSesion.last_names;
        systemEvent.action = "FINALIZAR SESIÓN";
        systemEvent.observation = "El usuario " + $scope.usuarioSesion.user + " finalizo sesión";

        console.log("EVEN SYSTEM: " + JSON.stringify(systemEvent));

        LoginService.saveSystemEvents(systemEvent).then(response => {

            if (!response.error) {
                $scope.usuario = {};
                $scope.usuarioSesion = new Object();

                localStorage.removeItem('usuarioSession');
                window.location.href = '/cerrarSession';
            }
        });
    };

    $scope.getUserSession = function() {

        if (localStorage.getItem('usuarioSession') === null || localStorage.getItem('usuarioSession') === "" || typeof(localStorage.getItem('usuarioSession')) === "undefined") {
            window.location.href = '/login';
        } else {
            var bytes = CryptoJS.AES.decrypt(localStorage.getItem('usuarioSession'), "circulocorp");
            var plaintext = bytes.toString(CryptoJS.enc.Utf8);

            $scope.usuarioSesion = JSON.parse(plaintext);

            if ($scope.usuarioSesion === null || $scope.usuarioSesion === "" || typeof($scope.usuarioSesion) === "undefined") {
                window.location.href = '/login';
            } else {
                //console.log(window.location.href);
            }
        }

    };

    $scope.showModal = function() {
        $('#Loading_Modal').modal('show');

    };

    $scope.hideModal = function() {
        $('#Loading_Modal').modal('hide');
    };
});

//Shell Controller
app.controller('ShellController', function($scope, NgTableParams, $http, ShellService) {

    $scope.shells = [];
    $scope.token = {};
    $scope.listShellsDB = [];
    $scope.listShellsMZone = [];

    $scope.usuarioSesion = new Object();

    $scope.consultarShells = function() {

        $('#mensajeGeneral').removeClass('alert alert-danger');
        $('#mensajeGeneral').text('');
        $('#mensajeGeneral').hide();
        $('#divMensajeGeneral').hide();

        var mensajeGeneral = $('#mensajeGeneral');
        var divMensajeGeneral = $('#divMensajeGeneral');


        //<div class="modal-backdrop fade show"></div>
        $('#Loading_Modal').modal('show');

        //const div = document.createElement('div');
        //div.className = 'modal-backdrop fade show';
        //document.getElementById('page-top').appendChild(div);

        ShellService.consultarShells().then(response => {

            console.log("RESPUESTA EN EL CONTROLLER [consultarShells]: " + JSON.stringify(response));

            if (!response.error) {
                $scope.shells = response.shells;

                if ($scope.shells !== null && $scope.shells.length > 0) {
                    $scope.tableParams = new NgTableParams({}, { dataset: $scope.shells });
                    $scope.tableParams.reload();

                    $('#Loading_Modal').modal('hide');

                    setTimeout(function() {
                        $('#Loading_Modal').modal('hide');
                    }, 1000);

                } else {
                    mensajeGeneral.addClass('alert alert-danger');
                    mensajeGeneral.text(response.message);

                    mensajeGeneral.show();
                    divMensajeGeneral.show();
                    window.scrollTo(0, 0);

                    $scope.shells = [];
                    $scope.tableParams = new NgTableParams({}, { dataset: $scope.shells });
                    $scope.tableParams.reload();

                    $('#Loading_Modal').modal('hide');
                    setTimeout(function() {
                        $('#Loading_Modal').modal('hide');
                    }, 1000);
                }

                var systemEvent = new Object();
                systemEvent.date = moment().format('YYYY/MM/DD HH:mm:ss');
                systemEvent.userEmail = $scope.usuarioSesion.user;
                systemEvent.userName = $scope.usuarioSesion.first_names + " " + $scope.usuarioSesion.last_names;
                systemEvent.action = "CONSULTA DE PERFILES";
                systemEvent.observation = "El usuario " + $scope.usuarioSesion.user + " consulto perfiles Mzone/Mprofile";

                console.log("EVEN SYSTEM: " + JSON.stringify(systemEvent));

                ShellService.saveSystemEvents(systemEvent).then(response => {

                });

            } else {
                mensajeGeneral.addClass('alert alert-danger');
                mensajeGeneral.text(response.message);

                mensajeGeneral.show();
                divMensajeGeneral.show();
                window.scrollTo(0, 0);

                $scope.shells = [];

                $scope.tableParams = new NgTableParams({}, { dataset: $scope.shells });
                $scope.tableParams.reload();

                $('#Loading_Modal').modal('hide');
                setTimeout(function() {
                    $('#Loading_Modal').modal('hide');
                }, 1000);
            }

        });

    };

    $scope.actualizarShells = function() {

        $('#mensajeGeneral').removeClass('alert alert-danger');
        $('#mensajeGeneral').text('');
        $('#mensajeGeneral').hide();
        $('#divMensajeGeneral').hide();

        var mensajeGeneral = $('#mensajeGeneral');
        var divMensajeGeneral = $('#divMensajeGeneral');

        $('#Loading_Modal').modal('show');

        //Se consultan los shells en base de datos
        ShellService.consultarShells().then(response => {
            //$('#Loading_Modal').modal('show');

            console.log("RESPUESTA EN EL CONTROLLER [consultarShells]: " + JSON.stringify(response));

            if (!response.error) {
                $scope.listShellsDB = response.shells;
                console.log("LISTA SHELLS BD: " + JSON.stringify($scope.listShellsDB));

                //Consultamos el token MZone
                ShellService.consultaTokenMzone().then(response => {
                    console.log("RESPUESTA EN EL CONTROLLER [consultaTokenMzone]: " + JSON.stringify(response));

                    if (!response.error) {


                        $scope.token.token = response.token;

                        //Consultamos los shells en MZone
                        ShellService.consultaShellsMzone($scope.token).then(response => {
                            console.log("RESPUESTA EN EL CONTROLLER [consultaShellsMzone]: " + JSON.stringify(response));

                            if (!response.error) {
                                $scope.listaShellsMZone = response.lista;
                                console.log("LISTA SHELLS MZONE: " + JSON.stringify($scope.listaShellsMZone));

                                if ($scope.listaShellsMZone === null || $scope.listaShellsMZone.length <= 0) {
                                    mensajeGeneral.addClass('alert alert-danger');
                                    mensajeGeneral.text('No se encontraron registros en la plataforma de MZone');

                                    mensajeGeneral.show();
                                    divMensajeGeneral.show();
                                    window.scrollTo(0, 0);

                                    $('#Loading_Modal').modal('hide');
                                    //$(".modal-backdrop").remove();
                                    //$("#Loading_Modal").remove();
                                } else {

                                    //var shellTemp = {"id": "3d1c7a39-c1ad-460d-bc91-eaff332bac33", "unit_Description": "a3tek0033", "unit_Id": "e390eafd-19ed-480d-a3cf-968655e25816", "vehicleType_Id": "dab92997-8cf0-4d51-b32d-fc98e3316827", "cofDueDate": "2013-07-19T00:00:00Z", "purchaseDate": "2013-07-19T00:00:00Z", "registration": "VIN1002", "vin": "VIN1002", "description": "VIN1002"};
                                    //$scope.listaShellsMZone.push(shellTemp);
                                    //console.log("+++++++++++++++++++++++++LISTA MODIFICADA: " + JSON.stringify($scope.listaShellsMZone));

                                    if ($scope.listaShellsMZone.length > 0) {

                                        if ($scope.listShellsDB === null || $scope.listShellsDB.length <= 0) {
                                            for (var i = 0; i < $scope.listaShellsMZone.length; i++) {
                                                var shell = {};
                                                shell.id = $scope.listaShellsMZone[i]["unit_Description"];
                                                shell.vehicle_Id = $scope.listaShellsMZone[i]["id"];
                                                shell.unit_Id = $scope.listaShellsMZone[i]["unit_Id"];
                                                shell.vehicleType_Id = $scope.listaShellsMZone[i]["vehicleType_Id"];
                                                shell.utcStartDate = $scope.listaShellsMZone[i]["utcStartDate"];
                                                shell.cofDueDate = $scope.listaShellsMZone[i]["cofDueDate"];
                                                shell.purchaseDate = $scope.listaShellsMZone[i]["purchaseDate"];
                                                shell.description = $scope.listaShellsMZone[i]["description"];
                                                shell.registration = $scope.listaShellsMZone[i]["registration"];
                                                shell.vin = $scope.listaShellsMZone[i]["vin"];
                                                shell.isFavorite = false;
                                                shell.status = false;
                                                shell.lastUpdate = moment().format('YYYY/MM/DD HH:mm:ss');

                                                console.log("SHELL: " + JSON.stringify(shell));

                                                ShellService.registrarShell(shell).then(response => {
                                                    console.log("RESPUESTA EN EL CONTROLLER [registrarShell]: " + JSON.stringify(response));
                                                });


                                                //$(".modal-backdrop").remove();
                                                //$("#Loading_Modal").remove();
                                            }

                                            $scope.consultarShells();
                                            window.scrollTo(0, 0);
                                            $('#Loading_Modal').modal('hide');
                                        } else {

                                            //var id = "";

                                            for (var i = 0; i < $scope.listaShellsMZone.length; i++) {
                                                var existe = false;

                                                for (var z = 0; z < $scope.listShellsDB.length; z++) {
                                                    if ($scope.listaShellsMZone[i]["unit_Description"] === $scope.listShellsDB[z]["id"]) {
                                                        if ($scope.listShellsDB[z]["status"] === null || $scope.listShellsDB[z]["isFavorite"] === false) {

                                                            var shell = {};
                                                            shell.id = $scope.listaShellsMZone[i]["unit_Description"];
                                                            shell.vehicle_Id = $scope.listaShellsMZone[i]["id"];
                                                            shell.unit_Id = $scope.listaShellsMZone[i]["unit_Id"];
                                                            shell.vehicleType_Id = $scope.listaShellsMZone[i]["vehicleType_Id"];
                                                            shell.utcStartDate = $scope.listaShellsMZone[i]["utcStartDate"];
                                                            shell.cofDueDate = $scope.listaShellsMZone[i]["cofDueDate"];
                                                            shell.purchaseDate = $scope.listaShellsMZone[i]["purchaseDate"];
                                                            shell.description = $scope.listaShellsMZone[i]["description"];
                                                            shell.registration = $scope.listaShellsMZone[i]["registration"];
                                                            shell.vin = $scope.listaShellsMZone[i]["vin"];
                                                            shell.isFavorite = false;
                                                            shell.status = false;
                                                            shell.lastUpdate = moment().format('YYYY/MM/DD HH:mm:ss');
                                                            //$scope.listShellsDB[z]["lastUpdate"] = moment().format('YYYY/MM/DD HH:mm:ss');

                                                            ShellService.actualizarShell(shell).then(response => {
                                                                console.log("RESPUESTA EN EL CONTROLLER [actualizarShell]: " + JSON.stringify(response));
                                                            });

                                                            //id = $scope.listShellsDB[z]["id"];
                                                            existe = true;
                                                            break;
                                                        } else {
                                                            existe = false;
                                                        }

                                                    }
                                                }

                                                if (!existe) {
                                                    var shell = {};
                                                    //console.log("ID: " + id);
                                                    //var idSub = id.charAt(id.length - 1);//id.substring(id.length - 1, 1);
                                                    //console.log("ID: " + idSub);
                                                    //var idNum = parseInt(idSub);
                                                    //console.log("ID: " + idNum);

                                                    shell.id = $scope.listaShellsMZone[i]["unit_Description"];
                                                    shell.vehicle_Id = $scope.listaShellsMZone[i]["id"];
                                                    shell.unit_Id = $scope.listaShellsMZone[i]["unit_Id"];
                                                    shell.vehicleType_Id = $scope.listaShellsMZone[i]["vehicleType_Id"];
                                                    shell.utcStartDate = $scope.listaShellsMZone[i]["utcStartDate"];
                                                    shell.cofDueDate = $scope.listaShellsMZone[i]["cofDueDate"];
                                                    shell.purchaseDate = $scope.listaShellsMZone[i]["purchaseDate"];
                                                    shell.description = $scope.listaShellsMZone[i]["description"];
                                                    shell.registration = $scope.listaShellsMZone[i]["registration"];
                                                    shell.vin = $scope.listaShellsMZone[i]["vin"];
                                                    shell.isFavorite = false;
                                                    shell.status = false;
                                                    shell.lastUpdate = moment().format('YYYY/MM/DD HH:mm:ss');

                                                    console.log("SHELL: " + JSON.stringify(shell));

                                                    ShellService.registrarShell(shell).then(response => {
                                                        console.log("RESPUESTA EN EL CONTROLLER [registrarShell]: " + JSON.stringify(response));
                                                    });
                                                }
                                            }


                                            var systemEvent = new Object();
                                            systemEvent.date = moment().format('YYYY/MM/DD HH:mm:ss');
                                            systemEvent.userEmail = $scope.usuarioSesion.user;
                                            systemEvent.userName = $scope.usuarioSesion.first_names + " " + $scope.usuarioSesion.last_names;
                                            systemEvent.action = "ACTUALIZAR PERFILES";
                                            systemEvent.observation = "El usuario " + $scope.usuarioSesion.user + " actualizo la tabla de perfiles Mzone/Mprofile";

                                            ShellService.saveSystemEvents(systemEvent).then(response => {

                                            });


                                            $scope.consultarShells();
                                            window.scrollTo(0, 0);
                                            $('#Loading_Modal').modal('hide');
                                            //$(".modal-backdrop").remove();
                                            //$("#Loading_Modal").remove();
                                        }

                                    } else {
                                        mensajeGeneral.addClass('alert alert-danger');
                                        mensajeGeneral.text('No se encontraron registros en la plataforma de MZone');

                                        mensajeGeneral.show();
                                        divMensajeGeneral.show();
                                        window.scrollTo(0, 0);

                                        $('#Loading_Modal').modal('hide');
                                        //$(".modal-backdrop").remove();
                                        //$("#Loading_Modal").remove();
                                    }

                                }

                            } else {
                                mensajeGeneral.addClass('alert alert-danger');
                                if (response.status === 1003) {
                                    mensajeGeneral.text(response.message);
                                } else {
                                    mensajeGeneral.text('Ocurrio un problema al consultar los shells mzone.\n' + 'Error: ' + response.status + ' ' + response.message);
                                }

                                mensajeGeneral.show();
                                divMensajeGeneral.show();
                                window.scrollTo(0, 0);

                                $('#Loading_Modal').modal('hide');
                                //$(".modal-backdrop").remove();
                                //$("#Loading_Modal").remove();
                            }

                        });


                    } else {
                        mensajeGeneral.addClass('alert alert-danger');
                        mensajeGeneral.text('Ocurrio un problema la obtener el token MZone.\n' + 'Error: ' + response.status + ' ' + response.message);

                        mensajeGeneral.show();
                        divMensajeGeneral.show();
                        window.scrollTo(0, 0);

                        $('#Loading_Modal').modal('hide');
                        //$(".modal-backdrop").remove();
                        //$("#Loading_Modal").remove();
                    }

                });


            } else {

                mensajeGeneral.addClass('alert alert-danger');
                mensajeGeneral.text(response.message);

                mensajeGeneral.show();
                divMensajeGeneral.show();
                window.scrollTo(0, 0);

                $('#Loading_Modal').modal('hide');
                //$(".modal-backdrop").remove();
                //$("#Loading_Modal").remove();

                $scope.shells = [];

                $scope.tableParams = new NgTableParams({}, { dataset: $scope.shells });
                $scope.tableParams.reload();

            }

        });

    };

    $scope.getUserSession = function() {

        if (localStorage.getItem('usuarioSession') === null || localStorage.getItem('usuarioSession') === "" || typeof(localStorage.getItem('usuarioSession')) === "undefined") {
            window.location.href = '/login';
        } else {
            var bytes = CryptoJS.AES.decrypt(localStorage.getItem('usuarioSession'), "circulocorp");
            var plaintext = bytes.toString(CryptoJS.enc.Utf8);

            $scope.usuarioSesion = JSON.parse(plaintext);

            if ($scope.usuarioSesion === null || $scope.usuarioSesion === "" || typeof($scope.usuarioSesion) === "undefined") {
                window.location.href = '/login';
            } else {
                //console.log(window.location.href);
            }
        }

    };

});

//Logs Controller
app.controller('LogController', function($scope, NgTableParams, $http, LogService) {

    $scope.usuario = {};
    $scope.usuarioSesion = new Object();
    $scope.logsBusqueda = {};
    $scope.fechaIni = '';
    $scope.fechaFin = '';

    $scope.seleccionarFechaIni = function() {
        $scope.logsBusqueda.fechaIni = $scope.logsBusqueda.fechaIni + " 00:00:00";
    };
    $scope.seleccionarFechaFin = function() {
        $scope.logsBusqueda.fechaFin = $scope.logsBusqueda.fechaFin + " 23:59:59";
    };

    $scope.consultarLogs = function() {

        $('#mensajeGeneral').removeClass('alert alert-danger');
        $('#mensajeGeneral').text('');
        $('#mensajeGeneral').hide();
        $('#divMensajeGeneral').hide();

        var mensajeGeneral = $('#mensajeGeneral');
        var divMensajeGeneral = $('#divMensajeGeneral');

        if (($scope.fechaIni !== null && $scope.fechaIni !== "" && typeof($scope.fechaIni) !== "undefined") && ($scope.fechaFin === null || $scope.fechaFin === "" || typeof($scope.fechaFin) === "undefined")) {
            mensajeGeneral.addClass('alert alert-danger');
            mensajeGeneral.text("Seleccione una Fecha Final");
            mensajeGeneral.show();
            divMensajeGeneral.show();
            return;
        }
        if (($scope.fechaFin !== null && $scope.fechaFin !== "" && typeof($scope.fechaFin) !== "undefined") && ($scope.fechaIni === null || $scope.fechaIni === "" || typeof($scope.fechaIni) === "undefined")) {
            mensajeGeneral.addClass('alert alert-danger');
            mensajeGeneral.text("Seleccione una Fecha Inicial");
            mensajeGeneral.show();
            divMensajeGeneral.show();
            return;
        }

        if (($scope.fechaIni !== null && $scope.fechaIni !== "" && typeof($scope.fechaIni) !== "undefined") && ($scope.fechaFin !== null && $scope.fechaFin !== "" && typeof($scope.fechaFin) !== "undefined")) {

            $scope.logsBusqueda.fechaIni = $scope.fechaIni + " 00:00:00";
            $scope.logsBusqueda.fechaFin = $scope.fechaFin + " 23:59:59";

            if ($scope.logsBusqueda.fechaIni > $scope.logsBusqueda.fechaFin) {
                mensajeGeneral.addClass('alert alert-danger');
                mensajeGeneral.text("La Fecha Inicial no puede ser mayor a la Fecha Final");
                mensajeGeneral.show();
                divMensajeGeneral.show();
                return;
            }
        }

        $('#Loading_Modal').modal('show');



        LogService.consultarLogs($scope.logsBusqueda).then(response => {

            console.log("RESPUESTA EN EL CONTROLLER [consultarLogs]: " + JSON.stringify(response));

            if (!response.error) {
                $scope.logs = response.logs;

                if ($scope.logs !== null && $scope.logs.length > 0) {
                    $scope.tableParams = new NgTableParams({}, { dataset: $scope.logs });
                    $scope.tableParams.reload();

                    $('#Loading_Modal').modal('hide');

                    setTimeout(function() {
                        $('#Loading_Modal').modal('hide');
                    }, 1000);

                } else {
                    mensajeGeneral.addClass('alert alert-danger');
                    mensajeGeneral.text(response.message);

                    mensajeGeneral.show();
                    divMensajeGeneral.show();
                    window.scrollTo(0, 0);

                    $scope.logs = [];
                    $scope.tableParams = new NgTableParams({}, { dataset: $scope.logs });
                    $scope.tableParams.reload();

                    $('#Loading_Modal').modal('hide');
                    setTimeout(function() {
                        $('#Loading_Modal').modal('hide');
                    }, 1000);
                }

                var systemEvent = new Object();
                systemEvent.date = moment().format('YYYY/MM/DD HH:mm:ss');
                systemEvent.userEmail = $scope.usuarioSesion.user;
                systemEvent.userName = $scope.usuarioSesion.first_names + " " + $scope.usuarioSesion.last_names;
                systemEvent.action = "CONSULTA DE LOGS";
                systemEvent.observation = "El usuario " + $scope.usuarioSesion.user + " consulto logs Mzone/Mprofile";

                console.log("EVEN SYSTEM: " + JSON.stringify(systemEvent));

                LogService.saveSystemEvents(systemEvent).then(response => {

                });

            } else {
                mensajeGeneral.addClass('alert alert-danger');
                mensajeGeneral.text(response.message);

                mensajeGeneral.show();
                divMensajeGeneral.show();
                window.scrollTo(0, 0);

                $scope.logs = [];

                $scope.tableParams = new NgTableParams({}, { dataset: $scope.logs });
                $scope.tableParams.reload();

                $('#Loading_Modal').modal('hide');
                setTimeout(function() {
                    $('#Loading_Modal').modal('hide');
                }, 1000);
            }

        });

    };

    $scope.getUserSession = function() {

        if (localStorage.getItem('usuarioSession') === null || localStorage.getItem('usuarioSession') === "" || typeof(localStorage.getItem('usuarioSession')) === "undefined") {
            window.location.href = '/login';
        } else {
            var bytes = CryptoJS.AES.decrypt(localStorage.getItem('usuarioSession'), "circulocorp");
            var plaintext = bytes.toString(CryptoJS.enc.Utf8);

            $scope.usuarioSesion = JSON.parse(plaintext);

            if ($scope.usuarioSesion === null || $scope.usuarioSesion === "" || typeof($scope.usuarioSesion) === "undefined") {
                window.location.href = '/login';
            } else {
                //console.log(window.location.href);
            }
        }

    };

});