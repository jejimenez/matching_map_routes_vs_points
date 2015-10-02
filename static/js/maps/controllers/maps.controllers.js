/**
* GMaps controller
* @namespace pooling.maps.controllers
*/
(function () {
  'use strict';

  angular
    .module('pooling.maps.controllers')
    .controller('GoMapsController', GoMapsController);

  GoMapsController.$inject = ['$scope', '$cookies', '$window', 'GoMaps', 'Authentication'];


  /**
  * @namespace GoMapsController
  */
  function GoMapsController($scope, $cookies, $window, GoMaps, Authentication) {

    $scope.gmap = {
      //fromAddress: 'Calgary',
      //streetAddress: "5111 47 St NE  Calgary, AB T3J 3R2",
      //businessWriteup: "<b>Calgary Police Service</b><br/>Calgary's Finest<br/>",
      //businessTitle: "Calgary Police Service",
      Lon: -74.0574995,
      Lat: 4.6519047,
      zoom: 11,
    };

    $scope.seekers;

    /**
    * @name initMapUserValues
    * @desc initialize the values previously saved by the seeker
    * @memberOf pooling.maps.controllers
    */

    initMapUserValues();

    $scope.$watch('gMap', function(map) {
      if (map) {
        console.log("ahora existe :)");
      }
      else
        console.log("noooooooo");
    });

    function initMapUserValues (){
      if(Authentication.isAuthenticated()){
        var authenticatedAccount = Authentication.getAuthenticatedAccount();
        var seekers;
        GoMaps.getMarkersSeeker(authenticatedAccount.username)
        .success(setSeekersMap);

        function setSeekersMap(data, status, headers, config){
          $scope.seekers = data;
          console.log(data);
          //console.log($scope.seekers);
          //var myLatLng = {lat: data[0].end_lat, lng: data[0].end_lnt};

/*
          if ($window.google && $window.google.maps) {
              console.log("cargadoooooooooo");
          } else {
              console.log("noo");
          };*/
          console.log($scope.gmap.markers)
          /*  var marker = new $window.google.maps.Marker({
              position: myLatLng,
              map: $scope.gmap.map,
              title: 'Hello World!'
            });*/
          return;
        }
        console.log($scope.seekers);
      }
      else
        console.log("no autenticado no cargar valores del usuario");

    }

    /**
    * @name saveMarkersSeeker
    * @desc save the markers of transport seeker
    * @memberOf pooling.maps.controllers
    */
    
    $scope.saveMarkersSeeker = function() {
      if(!$scope.gmap.markers || $scope.gmap.markers.length != 2){
        toastr['error']('Por favor seleccione los puntos de inicio y fin de la ruta deseada'); 
        return null;
      }
      console.log($scope.gmap.markers);
        //create seeker object

        GoMaps.setMarkersSeeker({
          start_lat : $scope.gmap.markers[0].getPosition().lat(),
          start_lng : $scope.gmap.markers[0].getPosition().lng(),
          start_point : "POINT("+$scope.gmap.markers[0].getPosition().lat()+" "+$scope.gmap.markers[0].getPosition().lng()+")",
          end_lat : $scope.gmap.markers[1].getPosition().lat(),
          end_lnt : $scope.gmap.markers[1].getPosition().lng(),
          end_point : "POINT("+$scope.gmap.markers[1].getPosition().lat()+" "+$scope.gmap.markers[1].getPosition().lng()+")",
          schedule : "1",
          description : ""
        })
        .success(loginSuccessFn)
        .error(loginErrFn);

      function loginSuccessFn(data, status, headers, config) {
        toastr['success']('Exitosamente creado.');
      }
      function loginErrFn(data, status, headers, config) {
        toastr['error']('Error: '+data.detail+'-'+status);
      }
    };

    $scope.showMessage = function (){
      toastr['error']('::'+$('#map_canvas').length); return null;
    };
  }
})();