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
      updateMarkerSeeker: updateMarkerSeeker,
      getMarkersSeeker: getMarkersSeeker,
      deleteMarkersSeeker:deleteMarkersSeeker,
      seekers:seekers,
    };

    return GoMapSrv;


    function setMarkersSeeker(seeker) {
      //toastr["info"]("esta es la funcion de insertar los markers");
      return $http.post('/api/v1/pooling/seekers/', seeker); 
    }

    function updateMarkerSeeker(seeker){

      return $http.put('/api/v1/pooling/seekers/' + seeker.id + '/', seeker);
    }

    function getMarkersSeeker(username) {
      //toastr["info"]("esta es la funcion de insertar los markers");
      return $http.get('/api/v1/pooling/accounts/'+username+'/seekers/'); 
    }

    function deleteMarkersSeeker(seeker) {
      return $http.delete('/api/v1/pooling/seekers/' + seeker.id + '/');
    }
  }
})();