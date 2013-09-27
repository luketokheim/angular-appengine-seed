'use strict';

// Declare the application module and declare its dependencies. By convention,
// app specific sub-modules are named "seed.*". 
angular.module('seed', ['ui.router', 'restangular',
                        'seed.controllers', 'seed.directives',
                        'seed.filters', 'seed.services']).
  constant('Config', {
    'app_url': 'https://angular-seed.appspot.com',
    'api_url': '/_ah/api/seed/v1/model',
    'api_base_url': '/_ah/api/seed/v1',
    'list_limit': 5,
    'version': 1
  }).
  config(['$stateProvider', '$urlRouterProvider', 'RestangularProvider', 'Config',
    function($stateProvider, $urlRouterProvider, RestangularProvider, Config) {
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
            //list: function() {
            //  return null;
            //}
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
        state('one', {
          url: '/one/{id}',
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

      // Use this to detect when a resolve fails during a view change. Show an
      // error page.
      $rootScope.$on('$stateChangeError',
        function(event, toState, toParams, fromState, fromParams, error) {
          //if ('error' != toState.name) {
          //  $state.go('error');
          //}
        }
      );
    }
  ]);