//angular
//  .module('thinkster', []);

(function () {
  'use strict';
//start page properties
//
  angular
    .module('pooling', [
      'pooling.maps',
      'pooling.authentication',
      'pooling.layout',
      'pooling.routes',
      'pooling.config',
      'ngMaterial', 
      'ngMessages'
      ]);


  angular.module('pooling.routes', ['ui.router']);
  angular.module('pooling.config', []);


  angular
  .module('pooling')
  .run(run);

  run.$inject = ['$http', '$window', '$rootScope', 'SocialMediaService'];


  var csrftoken = Cookies.get('csrftoken');
  /**
  * @name run
  * @desc Update xsrf $http headers to align with Django's defaults
  */
  function run($http, $window, $rootScope, SocialMediaService) {
    $http.defaults.xsrfHeaderName = 'X-CSRFToken';
    $http.defaults.xsrfCookieName = 'csrftoken';
    // Check if the user is authenticated in server and have the cookie created 
    console.log("USER_AUTH : "+USER_AUTH);
    if(USER_AUTH){
      if(typeof Cookies.get('authenticatedAccount') === 'undefined'){console.log('no cookies present');
        }
    }
    else{
      if(typeof Cookies.get('authenticatedAccount') !== 'undefined'){
        Cookies.remove('authenticatedAccount');
      }
    };
    //Facebook api  
    $window.fbAsyncInit = function() {
        FB.init({ 
          appId      : '1662044797371224',
          status: true, 
          cookie: true, 
          xfbml: true,
          version: 'v2.4'
        })};

    (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    // Google api
    /*
    $rootScope.$on('$viewContentLoaded', function(event) {
        SocialMediaService.load_gapi_auth();
    });*/
  }

  
  //set the header on your AJAX request, while protecting the CSRF token from being sent to other domains
  function csrfSafeMethod(method) {
      // these HTTP methods do not require CSRF protection
      return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
  }
  $.ajaxSetup({
      beforeSend: function(xhr, settings) {
          if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
              xhr.setRequestHeader("X-CSRFToken", csrftoken);
          }
      }
  });
  //toastr messages config
  toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-top-right",
    "preventDuplicates": false,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
  }

})();