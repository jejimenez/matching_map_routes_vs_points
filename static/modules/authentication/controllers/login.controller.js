/**
* LoginController
* @namespace thinkster.authentication.controllers
*/
(function () {
  'use strict';

  angular
    .module('thinkster.authentication.controllers')
    .controller('LoginController', LoginController);

  LoginController.$inject = ['$location', '$scope', '$http', 'Authentication', 'FacebookService'];

  /**
  * @namespace LoginController
  */
  function LoginController($location, $scope, $http, Authentication, FacebookService) {
    var vm = this;
    var loginForm = $('.ui.form.login');
    var errorForm = $('.ui.login.error');
    var val_result = false;

    vm.login = login;
    vm.login_fb = login_fb;

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


    /**
    * @name login_fb
    * @desc Log the user in with facebook service
    * @memberOf thinkster.authentication.controllers.LoginController
    */
    function login_fb(){
       
           FacebookService.login().then(function(response){
               //we come here only if JS sdk login was successful so lets 
               //make a request to our new view. I use Restangular, one can
               //use regular http request as well.
               var reqObj = {access_token: response.authResponse.accessToken,
                          backend: "facebook",
                          headers: {access_token: response.authResponse.accessToken, backend: "facebook"}
                        };
               //var u_b = Restangular.all('sociallogin/');
               //u_b.post(reqObj)
               //$http.post('/api/v1/auth/sociallogin/', reqObj)
               $http({
                  url: '/api/v1/auth/sociallogin/',
                  method: 'POST',
                  headers: {
                   'Authorization': 'bearer facebook '+response.authResponse.accessToken},
                  data: {access_token: response.authResponse.accessToken, backend: "facebook"}
                })
               .then(function(response) {
                  console.log(response)
                  Authentication.setAuthenticatedAccount(response);
                  window.location = '/';
                  console.log("OKk");
               }, function(response) { /*error*/
                   console.log("There was an error", response);
                   //deal with error here. 
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