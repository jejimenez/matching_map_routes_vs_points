/**
* LoginController
* @namespace thinkster.authentication.controllers
*/
(function () {
  'use strict';

  angular
    .module('thinkster.authentication.controllers')
    .controller('LoginController', LoginController);

  LoginController.$inject = ['$location', '$scope', '$http', 'Authentication', 'SocialMediaService'];

  /**
  * @namespace LoginController
  */
  function LoginController($location, $scope, $http, Authentication, SocialMediaService) {
    var vm = this;
    var loginForm = $('.ui.form.login');
    var errorForm = $('.ui.login.error');
    var val_result = false;
    var auth2;

    vm.login = login;
    vm.login_fb = login_fb;
    vm.login_g = login_g;

    //semantic validation rules and parameters
    (function ($) {
    loginForm.form({  
        on: 'blur',
        //--> hack to avoid the form submition
        onSuccess: function () {
          val_result = true;
          return false;
        },
        onFailure: function () {
          val_result = false;
          return false;
        },
        //<-- hack to avoid the form submition
        fields: {     
          email: {
            identifier: 'Email',
            rules: [{
              type: 'empty',
              prompt: 'Por favor ingrese su correo electrónico'
            },{
              type: 'email',
              prompt: 'Por favor ingrese un correo electrónico válido'
            }]
          },       
          password: {
            identifier: 'Password',
            rules: [{
              type: 'empty',
              prompt: 'Por favor ingrese su contraseña'
            },{
              type: 'length[6]',
              prompt: 'La contraseña debe tener al menos 6 caracteres'
            }]
          }
        }
      });
    }(jQuery));


    activate();

    /**
    * @name activate
    * @desc Actions to be performed when this controller is instantiated
    * @memberOf thinkster.authentication.controllers.LoginController
    */
    function activate() {
      // If the user is authenticated, they should not be here.
      if (Authentication.isAuthenticated()) {
        //$location.url('/');
        window.location = '/';
      }
    }

    function login_g(){
      SocialMediaService.go_login(function(res){
        console.log(res);
        /*$http({
                  url: '/api/v1/auth/socialdatasave/',
                  method: 'POST',
                  headers: {'Authorization' : 'bearer '+"google-oauth2"+' '+res.access_token},
                  data: {access_token: res.access_token, backend: "google-oauth2"}
                });*/
         SocialMediaService.social_login("google-oauth2", res.access_token, res)
         .then(function(resp){
            Authentication.setAuthenticatedAccount(resp.data);
            window.location = '/';
         });
      });
/*
      if(typeof gapi.auth2 === 'undefined'){
        console.error('Google api auth is not loaded');
      }
      else{
          auth2 = gapi.auth2.getAuthInstance(); 
          auth2.signIn().then(function(resp){
            console.log(resp);
            console.log(auth2.currentUser.get().getBasicProfile());

            gapi.client.plus.people.list({
              'userId': 'me',
              'collection': 'visible'
            }).then(function(res) {
              console.log(res);
            });
          });
      }*/
    }

    /**
    * @name login_fb
    * @desc Log the user in with facebook service
    * @memberOf thinkster.authentication.controllers.LoginController
    */
    function login_fb(){
       
           SocialMediaService.fb_login().then(function(fbresponse){
               //we come here only if JS sdk login was successful so lets 
               //make a request to our new view. I use Restangular, one can
               //use regular http request as well.
               console.log(JSON.parse(JSON.stringify(fbresponse.authResponse)));
               SocialMediaService.social_login("facebook", fbresponse.authResponse.accessToken, fbresponse)
               .then(function(resp){
                  Authentication.setAuthenticatedAccount(resp.data);
                  window.location = '/';
               });
           });
    }


    /**
    * @name login
    * @desc Log the user in
    * @memberOf thinkster.authentication.controllers.LoginController
    */
    function login() {
      loginForm.form('validate form');
      if(val_result === false){
        return;
      }
      //var auth = Authentication.login(vm.login.email, vm.login.password);
      var err;
      Authentication.login(vm.login.email, vm.login.password)
        .success(loginSuccessFn)
        .error(loginErrFn);

      function loginSuccessFn(data, status, headers, config) {
        Authentication.setAuthenticatedAccount(data);
        //$location.url('/');
        window.location = '/';
      }
      function loginErrFn(data, status, headers, config) {
        if(data)
          loginForm.form('add errors', [ data.message ]);
        else
          loginForm.form('add errors', [ 'Error tratando de conectar con el servidor' ]);
        errorForm.show();
      }
      return;
    }
  }
})();