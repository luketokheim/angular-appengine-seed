'use strict';

angular.module('seed.controllers', []).
  controller('ListCtrl', ['$scope', '$stateParams', 'list',
    function($scope, $stateParams, list) {
      $scope.list = list;

      $scope.load = function() {
        list.$query().then(function(data) {
          $scope.list = data;
        });
      };
    }
  ]).
  controller('ModelCtrl', ['$scope', '$state', 'model',
    function($scope, $state, model) {
      $scope.model = model;

      $scope.save = function() {
        var id = $scope.model.id; 
        $scope.model.$save().then(function(data) {
          $scope.model = data;
          if (id !== $scope.model.id) {
            if (!id) {
              id = $scope.model.id;
            }
            $state.go('model.detail', {id: id});
          }

          $scope.$parent.load();
        });
      };

      $scope.delete = function() {  
        $scope.model.$delete().then(function(data) {
          $scope.model = data;

          $state.go('^');
          $scope.$parent.load();
        });
      };
    }
  ]);