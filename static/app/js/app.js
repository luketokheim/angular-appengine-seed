'use strict';

angular.module('seed', ['ui.router', 'seed.controllers', 'seed.directives',
                        'seed.filters', 'seed.services']).
  config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
      $stateProvider.
        state('home', {
          url: '/home',
          templateUrl: '/app/partials/home.html'
        }).
        state('about', {
          url: '/about',
          templateUrl: '/app/partials/about.html'
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
              // Use /model/create path edit an empty model.
              if ('create' === $stateParams.id) {
                console.log('create');
                return new Model();
              } else {
                return Model.get($stateParams).$promise;
              }
            }]
          }
        });

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

      $rootScope.api_url = '/_ah/api/seed/v1/model';
    }
  ]);