(function () {
  'use strict';

  angular
    .module('pooling.maps', [
      'pooling.maps.services',
      'pooling.maps.controllers',
      'pooling.maps.directives',
    ]);

  angular
    .module('pooling.maps.services', ['ngCookies']);
    
  angular
    .module('pooling.maps.controllers', []);

  angular
    .module('pooling.maps.directives', []);

})();