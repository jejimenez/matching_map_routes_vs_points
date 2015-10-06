/**
* GoMapSrv
* @namespace pooling.maps.services
*/
(function () {
  'use strict';

  angular
    .module('pooling.maps.services')
    .factory('GoMapSrv', GoMapSrv);

  GoMapSrv.$inject = ['$cookies', '$http'];

  /**
  * @namespace GoMapSrv
  * @returns {Factory}
  */
  function GoMapSrv($cookies, $http) {
    /**
    * @name GoMapSrv
    * @desc The Factory to be returned
    */
    var maps = {};
    var tmap;
    var markers;
    var seekers;
    var GoMapSrv = {
      setMarkersSeeker: setMarkersSeeker,
      getMarkersSeeker: getMarkersSeeker,
      setSeekersData: setSeekersData,
      seekers:seekers,
    };

    return GoMapSrv;


    function setMarkersSeeker(seeker) {
      //toastr["info"]("esta es la funcion de insertar los markers");
      return $http.post('/api/v1/pooling/seekers/', seeker); 
    }

    function getMarkersSeeker(username) {
      //toastr["info"]("esta es la funcion de insertar los markers");
      return $http.get('/api/v1/pooling/accounts/'+username+'/seekers/'); 
    }

    function setSeekersData(data){
      seekers = data;
    }
 
  }
})();