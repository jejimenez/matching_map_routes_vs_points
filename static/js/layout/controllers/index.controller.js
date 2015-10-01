/**
* IndexController
* @namespace thinkster.layout.controllers
*/
(function () {
  'use strict';

  angular
    .module('pooling.layout.controllers')
    .controller('IndexController', IndexController);

  IndexController.$inject = ['$scope'];

  /**
  * @namespace IndexController
  */
  function IndexController($scope) {
    var vm = this;
    $scope.message = 'Everyone come and see how good I look!';

    //vm.isAuthenticated = Authentication.isAuthenticated();
    
    activate();

    /**
    * @name activate
    * @desc Actions to be performed when this controller is instantiated
    * @memberOf thinkster.layout.controllers.IndexController
    */
    function activate() {
      //Posts.all().then(postsSuccessFn, postsErrorFn);

    }
  }
})();