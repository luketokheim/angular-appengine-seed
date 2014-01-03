'use strict';

// Controllers contain the application/business logic needed for a single view.
// A controller is associated with an Angular scope object, all of the data
// available to populate an HTML template.
angular.module('seed.controllers', []).
  controller('ListCtrl', ['$scope', 'list', function($scope, list) {
    $scope.list = list;

    // Create or update model in list. Save in place or prepend.
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

    // Delete model from list.
    $scope.remove = function(model) {
      var idx = $scope.indexOf(model.id);
      return model.$delete(function() {
        if (idx >= 0) {
          $scope.list.splice(idx, 1);
        }
      });
    };

    // Return the integer index of the model in our internal list or -1 if does
    // not exist. Similar to Array.indexOf except matches on 'id' property.
    $scope.indexOf = function(id) {
      for (var i=0; i<$scope.list.length; i++) {
        if (id === $scope.list[i].id) {
          return i;
        }
      }

      return -1;
    };
  }]).
  controller('ModelCtrl', ['$scope', '$state', 'model',
    function($scope, $state, model) {
      if (model) {
        // Resolved before loading the controller.
        $scope.model = model;
      } else if ('id' in $state.params) {
        // Copy item from the parent list.
        var idx = -1;
        if ('indexOf' in $scope.$parent) {
          idx = $scope.$parent.indexOf($state.params.id);
        }

        if (idx >= 0) {
          $scope.model = angular.copy($scope.$parent.list[idx]);
        } else {
          // Request id not in the parent list. Change to our single item view.
          $state.go('detail', {id: $state.params.id});
        }
      }

      // Create or update this model.
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

      // Delete this model.
      $scope.remove = function(model) {
        var promise = null;
        if ('remove' in $scope.$parent) {
          promise = $scope.$parent.remove(model);
        } else {
          promise = model.$delete();
        }

        promise.then(function() {
          // Just deleted the model associated with this view state.
          $state.go('model.create');
        });

        return promise;
      };

      // Form ngSubmit handler.
      $scope.submit = function(form, model) {
        if (!form.$invalid && form.$dirty) {
          $scope.save(model).then(function() {
            form.$setPristine();
          });
        }
      };
    }
  ]);