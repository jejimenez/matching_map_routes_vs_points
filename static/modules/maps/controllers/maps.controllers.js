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

    $scope.google;

    $scope.authenticatedAccount = Authentication.getAuthenticatedAccount();

    /**
    * @name initMapUserValues
    * @desc initialize the values previously saved by the seeker
    * @memberOf pooling.maps.controllers
    */

    initMapUserValues();

    function initMapUserValues (){
      if(Authentication.isAuthenticated()){
        loadInitSeekers();
      }
    }

    function loadInitSeekers(){
      // reolad the initSeekers value
      GoMapSrv.getMarkersSeeker($scope.authenticatedAccount.username)
      .success(setSeekersMap);
      function setSeekersMap(data, status, headers, config){
        $scope.initSeekers = data;
      }
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
        .success(updatedSuccessFn)
        .error(errFn);
      }
      else{ 
        GoMapSrv.setMarkersSeeker(seeker)
        .success(createSuccessFn)
        .error(errFn);
        }

      function updatedSuccessFn(data, status, headers, config) {
        toastr['success']('Exitosamente modificado.');
        // reolad the initSeekers value
        loadInitSeekers();
      }
      function createSuccessFn(data, status, headers, config) {
        toastr['success']('Exitosamente creado.');
        console.log(data);
        data.show_message = false;
        $scope.seekers = data;
        // reolad the initSeekers value
        loadInitSeekers();
      }
      function errFn(data, status, headers, config) {
        toastr['error']('Error: '+data.detail+'-'+status);
      }
    };

    $scope.deleteMarkersSeeker = function (seeker){
      var seeker_del = (seeker ? seeker : $scope.seekers );
      GoMapSrv.deleteMarkersSeeker(seeker_del)
      .success(deleteSuccessFn)
      .error(errFn);
      
      function deleteSuccessFn(){
        loadInitSeekers();
        $scope.seekers = $scope.initSeekers[0];
        toastr['success']('Exitosamente eliminado');
      }
      function errFn(data, status, headers, config) {
        toastr['error']('Error: '+data.detail+'-'+status);
      }
    };

    // add a new seeker
    $scope.addMarkersSeeker = function (){
      //$scope.seekers = $scope.initSeekers[1];
      $scope.seekers = {};

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

    // set the value of seeker in scope to show the markers in map
    $scope.setMarkersSeeker = function(seeker){
      $scope.seekers = seeker;
    };


    $scope.showMessage = function(){
      console.log('showMessage');
        //(FB.api('/me/friends', function(response) {
         //console.log(response);
       //});
        FB.api('/me?fields=id,name,email,birthday,friends', function(response2) {
         //console.log('Good to see you in IndexController, ' + response2.id + '.');
         console.log(response2);
//10153338846013061
       });
/*
            FB.api('/10153338846013061', function(response3) {
             console.log('Good to see you in IndexController, ' + response3.id + '.');
             console.log(response3);
           });*/
    };

    // check when google maps is ready to get the value in scope
    $scope.$on('gmap.ready', function (event, google) {
      $scope.google = google;
    });
  }
})();