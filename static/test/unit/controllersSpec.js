'use strict';

describe('Seed controllers', function() {
  var list = [
    {"created": "2013-09-19T15:31:48.906000", "id": "1", "name": "Item One"},
    {"created": "2013-09-18T23:21:57.529000", "id": "2", "name": "Item Two"}
  ];
  //var model = list[0];

/*
  for (var i=0; i<list.length; i++) {
    list[i]['$save'] = function() {
      return {
        'then': function(fn) {
          fn(list[i]);
        }
      }
    };
  }
  */

  list['$query'] = function() {
    return {
      'then': function(fn) {
        fn(list);
      }
    }
  };

  var model = list[0];
  model['$save'] = function() {
    return {
      'then': function(fn) {
        fn(model);
      }
    }
  };
  model['$delete'] = function() {
    return {
      'then': function(fn) {
        fn({id: model.id});
      }
    }
  };

  beforeEach(function() {
    this.addMatchers({
      toEqualData: function(expected) {
        return angular.equals(this.actual, expected);
      }
    });
  });

  describe('ListCtrl', function() {
    beforeEach(module("seed.controllers"));

    var scope = null;
    var stateParams = {};
    var ctrl = null;

    beforeEach(inject(function($rootScope, $controller) {
      scope = $rootScope.$new();
      ctrl = $controller('ListCtrl', {
        $scope: scope,
        list: list
      });
    }));

    it("should initialize list", function() {
      expect(scope.list).toEqualData(list);
    });

    it("should load list", function() {
      //scope.load();
      expect(scope.list).toEqualData(list);
    });
  }); // ListCtrl

  describe('ModelCtrl', function() {
    beforeEach(module("seed.controllers"));

    var scope = null;
    var state = {
      go: function(name, param) {}
    };
    var ctrl = null;
    var parent = {
      /*
      save: function(model) {
        return {
          'then': function(fn) {
            fn(model);
          }
        }
      }
      */
    };

    beforeEach(inject(function($rootScope, $controller) {
      spyOn(state, 'go');
      //spyOn(parent, 'save');

      scope = $rootScope.$new();
      scope.$parent = parent;
      ctrl = $controller('ModelCtrl', {
        $scope: scope,
        $state: state,
        model: model
      });
    }));

    it("should initialize model", function() {
      expect(scope.model).toEqualData(model);
    });

    it("should save model", function() {
      model.name = "Hello World";
      scope.save();

      expect(scope.model).toEqualData(model);
      expect(scope.model.name).toBe("Hello World");

      //expect(parent.save).toHaveBeenCalled();
    });

    it("should delete model and go to create state", function() {
      scope.delete();

      expect(scope.model).not.toEqualData(model);
      expect(scope.model.id).toBe(model.id);

      expect(state.go).toHaveBeenCalledWith('model.create');
      //expect(parent.load).toHaveBeenCalled();
    });
  }); // ModelCtrl

});