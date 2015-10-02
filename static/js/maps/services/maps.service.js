/**
* GoMaps
* @namespace pooling.maps.services
*/
(function () {
  'use strict';

  angular
    .module('pooling.maps.services')
    .factory('GoMaps', GoMaps);

  GoMaps.$inject = ['$cookies', '$http'];

  /**
  * @namespace GoMaps
  * @returns {Factory}
  */
  function GoMaps($cookies, $http) {
    /**
    * @name GoMaps
    * @desc The Factory to be returned
    */
    var maps = {};
    var tmap;
    var markers;
    var GoMaps = {
      setMarkersSeeker: setMarkersSeeker,
      getMarkersSeeker: getMarkersSeeker,
    };

    return GoMaps;


    function setMarkersSeeker(seeker) {
      //toastr["info"]("esta es la funcion de insertar los markers");
      return $http.post('/api/v1/pooling/seekers/', seeker); 
    }

    function getMarkersSeeker(username) {
      //toastr["info"]("esta es la funcion de insertar los markers");
      return $http.get('/api/v1/pooling/accounts/'+username+'/seekers/'); 
    }
 
  }
})();