/**
* GMaps controller
* @namespace pooling.maps.controllers
*/
(function () {
  'use strict';

  angular
    .module('pooling.maps.controllers')
    .controller('GoMapsController', GoMapsController);

  GoMapsController.$inject = ['$scope', '$cookies', '$window', 'GoMapSrv', 'Authentication'];


  /**
  * @namespace GoMapsController
  */
  function GoMapsController($scope, $cookies, $window, GoMapSrv, Authentication) {

    $scope.GoMapSrv = GoMapSrv;
    $scope.objMap = {};
    $scope.seekers;
    $scope.gmapvals = {
      //fromAddress: 'Calgary',
      //streetAddress: "5111 47 St NE  Calgary, AB T3J 3R2",
      //businessWriteup: "<b>Calgary Police Service</b><br/>Calgary's Finest<br/>",
      //businessTitle: "Calgary Police Service",
      Lon: -74.0574995,
      Lat: 4.6519047,
      zoom: 11,
    };


    /**
    * @name initMapUserValues
    * @desc initialize the values previously saved by the seeker
    * @memberOf pooling.maps.controllers
    */

    initMapUserValues();

    function initMapUserValues (){
      if(Authentication.isAuthenticated()){
        var authenticatedAccount = Authentication.getAuthenticatedAccount();
        /*$scope.gmapvals = {
          Lon: -74.0574995,
          Lat: 4.6519047,
          zoom: 8,
        };*/

        var seekers;
        GoMapSrv.getMarkersSeeker(authenticatedAccount.username)
        .success(setSeekersMap);

        function setSeekersMap(data, status, headers, config){
          console.log('setSeekersMap');
          $scope.initSeekers = data;
          
          //console.log($scope.seekers);
          //var myLatLng = {lat: data[0].end_lat, lng: data[0].end_lnt};
/*
          if ($window.google && $window.google.maps) {
              console.log("cargadoooooooooo");
          } else {
              console.log("noo");
          };*/
          //console.log($scope.gmapvals.markers)

          /*  var marker = new $window.google.maps.Marker({
              position: myLatLng,
              map: $scope.gmapvals.map,
              title: 'Hello World!'
            });*****
          return;*/
        }
        //console.log($scope.GoMapSrv.seekers);
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
      if(!$scope.gmapvals.markers || $scope.gmapvals.markers.length != 2){
        toastr['error']('Por favor seleccione los puntos de inicio y fin de la ruta deseada'); 
        return null;
      }
      console.log($scope.gmapvals.markers);
        //create seeker object

        GoMapSrv.setMarkersSeeker({
          start_lat : $scope.gmapvals.markers[0].getPosition().lat(),
          start_lng : $scope.gmapvals.markers[0].getPosition().lng(),
          start_point : "POINT("+$scope.gmapvals.markers[0].getPosition().lat()+" "+$scope.gmapvals.markers[0].getPosition().lng()+")",
          end_lat : $scope.gmapvals.markers[1].getPosition().lat(),
          end_lnt : $scope.gmapvals.markers[1].getPosition().lng(),
          end_point : "POINT("+$scope.gmapvals.markers[1].getPosition().lat()+" "+$scope.gmapvals.markers[1].getPosition().lng()+")",
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
      console.log('okkkkkkk2');
      toastr['error']('::'+$('#map_canvas').length); 
      console.log($scope.GoMapSrv.seekers);

    $scope.seekers = {
      end_lat: 4.62570408986198200000,
      end_lnt: -74.13780212402344000000,
      end_point: Object,
      id: 1,
      schedule: 1,
      start_lat: 4.78446896657937500000,
      start_lng: -74.06021118164062000000,
    }


    };
  }
})();