/**
* FacebookService
* @namespace thinkster.facebook.services
*/
(function () {
  'use strict';

  angular
    .module('thinkster.authentication.services')
    .factory('FacebookService', FacebookService);

  FacebookService.$inject = ['$q', '$window', '$rootScope'];

  /**
  * @namespace FacebookService
  * @returns {Factory}
  */
  function FacebookService($q, $window, $rootScope) {
    /**
    * @name FacebookService
    * @desc The Factory to be returned
    */

    var FacebookService = {
      resolve: resolve,
      login: login,
    };

    return FacebookService;

    ////////////////////

    /**
    * @name resolve
    * @desc since we are resolving a thirdparty response, we need to do so in $apply 
    * @param {string} errval
    * @param {string} retval
    * @param {string} deferred
    * @returns {Promise}
    * @memberOf thinkster.authentication.services.FacebookService
    */
    function resolve(errval, retval, deferred) {
      $rootScope.$apply(function() {
          if (errval) {
        deferred.reject(errval);
          } else {
        retval.connected = true;
              deferred.resolve(retval);
          }
      });
    }
    /**
    * @name _login
    * @desc _login
    * @returns {Promise}
    * @memberOf thinkster.authentication.services.FacebookService
    */
    function login(){
      var deferred = $q.defer();
            //first check if we already have logged in
      FB.getLoginStatus(function(response) {
          if (response.status === 'connected') {
              // the user is logged in and has authenticated your
              // app
              console.log("fb user already logged in");
              deferred.resolve(response);
          } else {
              // the user is logged in to Facebook, 
              // but has not authenticated your app
              FB.login(function(response){
                  if(response.authResponse){
                console.log("fb user logged in");
                resolve(null, response, deferred);
            }else{
                console.log("fb user could not log in");
                resolve(response.error, null, deferred);
            }
              });
           }
             });
            
       return deferred.promise;
    } 
  }
})();