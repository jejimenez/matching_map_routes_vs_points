(function () {
  'use strict';

  angular
    .module('pooling.routes')
    .config(config);
/*
  config.$inject = ['$routeProvider'];

  function config($routeProvider) {
    $routeProvider.when('/register', {
      controller: 'RegisterController', 
      controllerAs: 'vm',
      templateUrl: '/static/templates/authentication/register.html'
    }).when('/login', {
      controller: 'LoginController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/authentication/login.html'
    }).when('/admin', {
      templateUrl: '/admin'
    }).when('/', {
      controller: 'GoMapsController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/layout/index.html'
    }).when('/+:username', {
      controller: 'ProfileController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/profiles/profile.html'
    }).when('/+:username/settings', {
      controller: 'ProfileSettingsController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/profiles/settings.html'
    }).otherwise('/');
  }
  */
  config.$inject = ['$stateProvider', '$urlRouterProvider'];

 function config($stateProvider, $urlRouterProvider){
    $urlRouterProvider.otherwise('/home');
    
    $stateProvider
        
        // HOME STATES AND NESTED VIEWS ========================================
      .state('home', {
        url: '/home',
        templateUrl: '/static/modules/layout/views/index.html'
      })
        
        // ABOUT PAGE AND MULTIPLE NAMED VIEWS =================================
        .state('login', {
      controller: 'LoginController',
      url: '/login',
      templateUrl: '/static/modules/authentication/views/login.html'   
        })
        // ABOUT PAGE AND MULTIPLE NAMED VIEWS =================================
        .state('register', {
      controller: 'RegisterController',
      url: '/register',
      templateUrl: '/static/modules/authentication/views/register.html' 
        });
      }
        
})();