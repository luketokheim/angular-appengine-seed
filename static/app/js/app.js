'use strict';

// Declare the application module and declare its dependencies. By convention,
// app specific sub-modules are named "seed.*". 
angular.module('seed', ['ngRoute', 'ui.router',
                        'seed.controllers', 'seed.directives',
                        'seed.filters', 'seed.services']).
  constant('Config', {
    'app_url': 'https://angular-seed.appspot.com',
    'api_url': '/_ah/api/seed/v1/model',
    'list_limit': 5,
    'version': 1
  }).
  config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
      $routeProvider.
        when('/about', {
          templateUrl: '/app/partials/about.html'
        }).
        when('/error', {
          templateUrl: '/app/partials/error.html'
        }).
        when('/model', {
          templateUrl: '/app/partials/model.html',
          controller: 'ListCtrl',
          resolve: {
            list: ['Model', '$route', function(Model, $route) {
              return Model.query($route.current.params).$promise;
            }]
          }
        }).
        when('/model/create', {
          templateUrl: '/app/partials/model.html',
          controller: 'ListCtrl',
          resolve: {
            list: ['Model', function(Model) {
              return new Model();
            }]
          }
        }).
        when('/model/:id', {
          templateUrl: '/app/partials/model.detail.html',
          controller: 'ModelCtrl',
          resolve: {
            model: ['Model', '$route', function(Model, $route) {
              return Model.get($route.current.params).$promise;
            }]
          }
        }).
        otherwise({redirectTo: '/model'});
    }
  ]).
  run(['$rootScope', '$location', '$routeParams',
    function($rootScope, $location, $routeParams) {
      $rootScope.$location = $location;
      $rootScope.$routeParams = $routeParams;
    }
  ]);
  /*
  config(['$stateProvider', '$urlRouterProvider', 'Config',
    function($stateProvider, $urlRouterProvider, Config) {
      // View routing. Associate views with their controllers. In this example,
      // we also resolve the initial data for views before displaying them.
      $stateProvider.
        state('about', {
          url: '/about',
          templateUrl: '/app/partials/about.html'
        }).
        state('error', {
          url: '/error',
          templateUrl: '/app/partials/error.html'
        }).
        state('model', {
          url: '/model',
          templateUrl: '/app/partials/model.html',
          abstract: true,
          controller: 'ListCtrl',
          resolve: {
            list: ['Model', '$stateParams', function(Model, $stateParams) {
              return Model.query($stateParams).$promise;
            }]
          }          
        }).
        // Using the ui-router dot syntax. The next three views are nested
        // inside the view named "model".
        state('model.list', {
          url: '',
          templateUrl: '/app/partials/model.list.html'
        }).
        state('model.create', {
          url: '/create',
          templateUrl: '/app/partials/model.detail.html',
          controller: 'ModelCtrl',
          resolve: {
            model: ['Model', function(Model) {
              return new Model();
            }]
          }
        }).
        state('model.detail', {
          url: '/{id}',
          templateUrl: '/app/partials/model.detail.html',
          controller: 'ModelCtrl',
          resolve: {
            model: ['Model', '$stateParams', function(Model, $stateParams) {
              return Model.get($stateParams).$promise;
            }]
          }
        }).
        // Non-nested view of a single model.
        state('detail', {
          url: '/model/{id}/detail',
          templateUrl: '/app/partials/model.detail.html',
          controller: 'ModelCtrl',
          resolve: {
            model: ['Model', '$stateParams', function(Model, $stateParams) {
              return Model.get($stateParams).$promise;
            }]
          }
        });

      // Default route.
      $urlRouterProvider.otherwise('model');
    }
  ]).
*/
/*
  run(['$rootScope', '$state', '$stateParams',
    function($rootScope, $state, $stateParams) {
      // As per ui-router docs...
      // It's very handy to add references to $state and $stateParams to the
      // $rootScope so that you can access them from any scope within your
      // applications. For example,
      // <li ng-class="{active: $state.includes('contacts.list')}"> will set
      // the <li> to active whenever 'contacts.list' or one of its decendents is
      // active.      
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;

      // Use this to detect when a resolve fails during a view/controller
      // change. Show an error page.
      $rootScope.$on('$stateChangeError',
        function(event, toState, toParams, fromState, fromParams, error) {
          //if ('model.detail' === toState.name) {
          //  $state.go('model.list');
          //} else
          if ('error' !== toState.name) {
            $state.go('error');
          }
        }
      );
    }
  ]);
  */