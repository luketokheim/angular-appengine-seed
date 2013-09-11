'use strict';

angular.module('seed.controllers', []).
  controller('ModelCtrl', ['$scope', '$state', 'model',
    function($scope, $state, model) {
      $scope.model = model;

      $scope.save = function() {
        var id = $scope.model.id; 
        $scope.model.$save().then(function() {
          if (id !== $scope.model.id) {
            if (id) {
              $state.go($state.current.name, {id: id});
            } else {
              $state.go('^');
            }
          }
          $scope.$parent.load();
        });
      };
    }
  ]).
  controller('ModelListCtrl', ['$scope', '$stateParams', 'Model',
    function($scope, $stateParams, Model) {
      $scope.load = function(params) {
        $scope.list = Model.query(params);
      };

      $scope.page = function(token) {
        var params = angular.copy($stateParams);
        params.pageToken = token;

        $scope.load(params);
      };

      $scope.load($stateParams);
    }
  ]);