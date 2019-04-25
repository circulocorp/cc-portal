(function($) {
  "use strict"; // Start of use strict

  // Toggle the side navigation
  $("#sidebarToggle").on('click',function(e) {
    e.preventDefault();
    $("body").toggleClass("sidebar-toggled");
    $(".sidebar").toggleClass("toggled");
  });

  // Prevent the content wrapper from scrolling when the fixed side navigation hovered over
  $('body.fixed-nav .sidebar').on('mousewheel DOMMouseScroll wheel', function(e) {
    if ($(window).width() > 768) {
      var e0 = e.originalEvent,
        delta = e0.wheelDelta || -e0.detail;
      this.scrollTop += (delta < 0 ? 1 : -1) * 30;
      e.preventDefault();
    }
  });

  // Scroll to top button appear
  $(document).on('scroll',function() {
    var scrollDistance = $(this).scrollTop();
    if (scrollDistance > 100) {
      $('.scroll-to-top').fadeIn();
    } else {
      $('.scroll-to-top').fadeOut();
    }
  });

  // Smooth scrolling using jQuery easing
  $(document).on('click', 'a.scroll-to-top', function(event) {
    var $anchor = $(this);
    $('html, body').stop().animate({
      scrollTop: ($($anchor.attr('href')).offset().top)
    }, 1000, 'easeInOutExpo');
    event.preventDefault();
  });

})(jQuery); // End of use strict



var app = angular.module('ccportal', ['ngTable']);


//Vehicles Controller

app.controller('VehiclesCtl', function ($scope, NgTableParams, $http) {
    
  $scope.vehicle = {};

	$scope.editVehicle = function(vehicle){
		$scope.vehicle = vehicle;
		$('#modalvehicleForm').modal();
	}

  $scope.saveVehicle = function(){
    var vehicle = $scope.vehicle;
    $http.patch('./api/vehicles', vehicle).then(function(response){
      $scope.refreshVehicles();
      $scope.cancelVehicle();
    });
  }

  $scope.refreshVehicles = function(){
    $http.get('./api/vehicles').then(function(response){
      $scope.tableParams = new NgTableParams({filter:{}}, { dataset: response.data });
    });
  }

  $scope.cancelVehicle = function(){
    $scope.vehicle = {}
   $('#modalvehicleForm').modal('hide'); 
  }

  $scope.refreshVehicles();
});

app.controller('ServiceACtl', function ($scope, NgTableParams, $http) {

	$scope.account = {};

	$http.get('./api/serviceaccounts').then(function(response){
		$scope.tableParams = new NgTableParams({filter:{}}, { dataset: response.data });
	});

	$scope.newAccount = function(){
		$scope.account = null;
		$scope.account = {};
		$('#modalaccountForm').modal();
	}

	$scope.editAccount = function(account){
		console.log(account);
		$scope.account = account;
		$('#modalaccountForm').modal();
	}

	$scope.cancelAccount = function(){
		$('#modalaccountForm').modal('hide');	
	}
});


app.controller('NotifiCtl', function($scope, NgTableParams, $http){
  $scope.notification = {};
  $scope.refreshNotifications = function(){
    $http.get('./api/notifications').then(function(response){
      $scope.tableParams = new NgTableParams({filter:{}}, { dataset: response.data });
    });
  }

  $scope.newNotification = function(){
    $scope.notification = null;
    $scope.notification = {};
    $('#modalnotificationForm').modal();
  }

  $scope.saveNotification = function(){
    var notification = $scope.notification;
    console.log(notification);
    if(notification["_id"]){
      $http.post('./api/notifications', notification).then(function(response){
        $scope.cancelNotification();
      });
    }else{
      $http.patch('./api/notifications', notification).then(function(response){
        $scope.cancelNotification();
      });
    }
  }

  $scope.showAskDeleteNoti = function(notification){
    $('#modalAskDeleteNoti').modal();
    $scope.notification = notification;
  }

  $scope.deleteNotification = function(){
    var notification = $scope.notification;
    $http.delete('./api/notifications/'+notification["_id"]).then(function(response){
        $scope.cancelAskDeleteNoti();
        $scope.refreshNotifications();
    });
  }

  $scope.editNotification = function(notification){
    $scope.notification = notification;
    $('#modalnotificationForm').modal();
  }

  $scope.cancelNotification = function(){
   $('#modalnotificationForm').modal('hide'); 
  }

  $scope.cancelAskDeleteNoti = function(){
    $scope.notification = {};
   $('#modalAskDeleteNoti').modal('hide');
  }
  $scope.refreshNotifications();
});



app.controller('SQLCtl', function($scope, NgTableParams, $http) {

  $scope.searchOS = function(){
    var filter = $scope.filter;
    $http.post('./sql/ordenes', filter).then(function(response){
      $scope.tableParams = new NgTableParams({filter:{}}, { dataset: response.data });
    })
  }
});