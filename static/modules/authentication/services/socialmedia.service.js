/**
* SocialMediaService
* @namespace thinkster.facebook.services
*/
(function () {
  'use strict';

  angular
    .module('thinkster.authentication.services')
    .factory('SocialMediaService', SocialMediaService);

  SocialMediaService.$inject = ['$q', '$window', '$rootScope', '$http', 'Authentication'];

  /**
  * @namespace SocialMediaService
  * @returns {Factory}
  */
  function SocialMediaService($q, $window, $rootScope, $http, Authentication) {
    /**
    * @name SocialMediaService
    * @desc The Factory to be returned
    */

    var auth2;

    var SocialMediaService = {
      resolve: resolve,
      fb_login: fb_login,
      social_login: social_login,
      load_gapi_auth: load_gapi_auth,
      go_login: go_login,
    };

    return SocialMediaService;

    ////////////////////

    /**
    * @name resolve
    * @desc since we are resolving a thirdparty response, we need to do so in $apply 
    * @param {string} errval
    * @param {string} retval
    * @param {string} deferred
    * @returns {Promise}
    * @memberOf thinkster.authentication.services.SocialMediaService
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
    * @memberOf thinkster.authentication.services.SocialMediaService
    */
    function fb_login(){
      var deferred = $q.defer();
            //first check if we already have logged in
      FB.getLoginStatus(function(response) {
          console.log(response.authResponse);
          if (response.status === 'connected') {
              // the user is logged in and has authenticated your
              // app
              console.log("fb user already logged in");
              FB.api('/me?fields=id,name,email,birthday,friends,gender,picture,link', function(fbresponse) {
                fbresponse.authResponse = response.authResponse;
                deferred.resolve(fbresponse);
              });
          } else {
              // the user is logged in to Facebook, 
              // but has not authenticated your app
            FB.login(function(response){
              if(response.authResponse){
                  console.log("fb user logged in");
                  console.log(response.authResponse);
                  FB.api('/me?fields=id,name,email,birthday,friends', function(fbresponse) {
                    fbresponse.authResponse = response.authResponse;
                    resolve(null, fbresponse, deferred);
                  });
              }else{
                  console.log("fb user could not log in");
                  resolve(response.error, null, deferred);
              }
            }, {scope: ['email', 'user_birthday', 'public_profile', 'user_friends']});
          }
      });
            
       return deferred.promise;
    } 
    /**
    * @name _login
    * @desc _login
    * @returns {Promise}
    * @memberOf thinkster.authentication.services.SocialMediaService
    */
    function social_login(backend, accessToken, data){
       return $http({
                  url: '/api/v1/auth/sociallogin/',
                  method: 'POST',
                  headers: {'Authorization' : 'bearer '+backend+' '+accessToken},
                  data: {access_token: accessToken, backend: backend, data:data}
                });
    }

    function go_login(callback){
      auth2 = gapi.auth2.getAuthInstance(); 
      auth2.signIn().then(function(signresp){
        console.log(signresp);
        console.log(JSON.parse(JSON.stringify(signresp.getBasicProfile())));
        gapi.client.plus.people.list({
          'userId': 'me',
          'collection': 'visible'
        }).then(function(peopleresp) {
          gapi.client.plus.people.get({'userId': 'me'}).then(function(profileresp){
            profileresp.access_token = auth2.currentUser.get().getAuthResponse().access_token;
            profileresp.people = peopleresp.result;
            callback(profileresp);
          });
        });
      });
    }


    function load_gapi_auth(){
      if(typeof gapi.auth2 === 'undefined'){
        gapi.load('auth2', function() {
          gapi.client.load('plus','v1').then(function() {
            gapi.auth2.init({fetch_basic_profile: true,
                cookiepolicy : 'single_host_origin',
                approvalprompt : 'force',
                scope:'https://www.googleapis.com/auth/plus.login'}).then(
                  function (){
                    auth2 = gapi.auth2.getAuthInstance();
                    auth2.isSignedIn.listen(update_gapi_signin);
                    auth2.then(update_gapi_signin());
                  });
          });
        });
      }
    }

    function update_gapi_signin() {
      if (auth2.isSignedIn.get()) {
        console.log("is signed in");
      }else{
        console.log("is NOT signed in");
      }
    }


  }
})();