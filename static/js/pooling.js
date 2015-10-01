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
      'pooling.config'
      ]);


  angular.module('pooling.routes', ['ui.router']);
  angular.module('pooling.config', []);


  angular
  .module('pooling')
  .run(run);

  run.$inject = ['$http'];


  var csrftoken = Cookies.get('csrftoken');
  /**
  * @name run
  * @desc Update xsrf $http headers to align with Django's defaults
  */
  function run($http) {
    $http.defaults.xsrfHeaderName = 'X-CSRFToken';
    $http.defaults.xsrfCookieName = 'csrftoken';
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