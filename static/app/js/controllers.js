'use strict';

angular.module('seed.controllers', []).
  controller('ListCtrl', ['$scope', 'list',
    function($scope, list) {
      $scope.list = list;

      $scope.save = function(model) {
        var idx = $scope.indexOf(model.id);
        return model.$save(function() {
          if (idx >= 0) {
            $scope.list[idx] = angular.copy(model);
          } else {
            $scope.list.unshift(model);
          }
        });
      };

      $scope.delete = function(model) {
        var idx = $scope.indexOf(model.id);
        return model.$delete(function() {
          if (idx >= 0) {
            $scope.list.splice(idx, 1);
          }
        });
      };

      $scope.indexOf = function(id) {
        for (var i=0; i<$scope.list.length; i++) {
          if (id === $scope.list[i].id) {
            return i;
          }
        }

        return -1;
      };
    }
  ]).
  controller('ModelCtrl', ['$scope', '$state', 'model',
    function($scope, $state, model) {
      $scope.model = model;

      $scope.save = function(model) {
        var id = model.id;
        var promise = null;
        if ('save' in $scope.$parent) {
          promise = $scope.$parent.save(model);
        } else {
          promise = model.$save();
        }

        promise.then(function() {
          // If the model id changes we should change our view state.
          if (id !== model.id) {
            $state.go('model.detail', {id: model.id});
          }
        });

        return promise;
      };

      $scope.delete = function(model) {
        var promise = null;
        if ('delete' in $scope.$parent) {
          promise = $scope.$parent.delete(model);
        } else {
          promise = model.$delete();
        }

        promise.then(function() {
          // Just deleted the model associated with this view state.
          $state.go('model.create');
        });

        return promise;
      };

      $scope.submit = function(form, model) {
        if (!form.$invalid && form.$dirty) {
          $scope.save(model).then(function() {
            form.$setPristine();
          });
        }
      };
    }
  ]);