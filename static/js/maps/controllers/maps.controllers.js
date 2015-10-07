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
        GoMapSrv.getMarkersSeeker(authenticatedAccount.username)
        .success(setSeekersMap);

        function setSeekersMap(data, status, headers, config){
          //GoMapSrv.setSeekersData(data);
          $scope.initSeekers = data;
          
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
        var seeker = {
          start_lat : $scope.gmapvals.markers[0].getPosition().lat(),
          start_lng : $scope.gmapvals.markers[0].getPosition().lng(),
          start_point : "POINT("+$scope.gmapvals.markers[0].getPosition().lat()+" "+$scope.gmapvals.markers[0].getPosition().lng()+")",
          end_lat : $scope.gmapvals.markers[1].getPosition().lat(),
          end_lnt : $scope.gmapvals.markers[1].getPosition().lng(),
          end_point : "POINT("+$scope.gmapvals.markers[1].getPosition().lat()+" "+$scope.gmapvals.markers[1].getPosition().lng()+")",
          schedule : "1",
          description : ""
        };
        if($scope.gmapvals.markers[0].getIdSeeker()){
          seeker.id = $scope.gmapvals.markers[0].getIdSeeker();
          seeker.description = 'MODIFIED!!!!!!!!!!!!!1';
          console.log(seeker);
          GoMapSrv.updateMarkerSeeker(seeker)
          .success(loginSuccessFn)
          .error(loginErrFn);
        }
        else{ 
          GoMapSrv.setMarkersSeeker(seeker)
          .success(loginSuccessFn)
          .error(loginErrFn);
        }

      function loginSuccessFn(data, status, headers, config) {
        toastr['success']('Exitosamente creado.');
      }
      function loginErrFn(data, status, headers, config) {
        toastr['error']('Error: '+data.detail+'-'+status);
      }
    };

    $scope.showMessage = function (){
      $scope.seekers = $scope.initSeekers[1];
      /*
      $scope.seekers = {
        end_lat: 4.62570408986198200000,
        end_lnt: -74.13780212402344000000,
        end_point: Object,
        id: 1,
        schedule: 1,
        start_lat: 4.78446896657937500000,
        start_lng: -74.06021118164062000000,
      }*/


    };
  }
})();