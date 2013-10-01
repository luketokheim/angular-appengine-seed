'use strict';

angular.module('seed.states', []).
  config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
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
          url: '/{id:[0-9]+}',
          templateUrl: '/app/partials/model.detail.html',
          controller: 'ModelCtrl',
          resolve: {
            //model: ['Model', '$stateParams', function(Model, $stateParams) {
            //  return Model.get($stateParams).$promise;
            //}]
            model: function() {
              return null;
            }
          }
        }).
        // Non-nested view of a single model.
        state('detail', {
          url: '/model/{id:[0-9]+}/detail',
          templateUrl: '/app/partials/model.detail.html',
          controller: 'ModelCtrl',
          resolve: {
            model: ['Model', '$stateParams', function(Model, $stateParams) {
              return Model.get($stateParams).$promise;
            }]
          }
        });

      // Default route. Not a named state.
      $urlRouterProvider.otherwise('/model');
    }
  ]);