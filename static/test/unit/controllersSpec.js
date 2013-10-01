'use strict';

describe('Seed controllers', function() {
  var list = [
    {"created": "2013-09-19T15:31:48.906000", "id": "1", "name": "Item One"},
    {"created": "2013-09-18T23:21:57.529000", "id": "2", "name": "Item Two"}
  ];
  list['$query'] = function(fn) {
    if (fn) {
      fn(list);
    }
    return {
      'then': function(fn) {
        fn(list);
      }
    }
  };

  list = list.map(function(item) {
    item['$save'] = function(fn) {
      var model = self;
      if (!model.id) {
        model.id = "3";
        model.created = "2013-09-20T12:21:57.529000";
      }

      if (fn) {
        fn(model);
      }
      return {
        'then': function(fn) {
          fn(model);
        }
      }
    };
    item['$delete'] = function(fn) {
      if (fn) {
        fn(item);
      }
      return {
        'then': function(fn) {
          fn({id: item.id});
        }
      }
    };
    return item;
  });

  var model = list[0];

  beforeEach(function() {
    this.addMatchers({
      toEqualData: function(expected) {
        return angular.equals(this.actual, expected);
      }
    });
  });

  describe('ListCtrl', function() {
    beforeEach(module('seed.controllers'));

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

    it('should initialize list', function() {
      expect(scope.list).toEqualData(list);
    });

    it('should load list', function() {
      expect(scope.list).toEqualData(list);
    });

    it('should find item 0 in list', function() {
      expect(scope.indexOf(model.id)).toBe(0);
    });

    it('should remove item 0 from list', function() {
      expect(scope.list.length).toBe(2);
      scope.delete(model);
      expect(scope.list.length).toBe(1);
      expect(scope.indexOf(model.id)).toBe(-1);
    });

    it('should add item to list', function() {
      expect(scope.indexOf(model.id)).toBe(-1);
      expect(scope.list.length).toBe(1);
      scope.save(model);
      expect(scope.list.length).toBe(2);
      expect(scope.indexOf(model.id)).toBe(0);
    });

    it('it should remove all items from list', function() {
      var list_copy = angular.copy(list);
      for (var i=0; i<list_copy.length; i++) {
        scope.delete(list_copy[i]);
      }

      expect(scope.list.length).toBe(0);
    });
  }); // ListCtrl

  describe('ModelCtrl', function() {
    beforeEach(module('seed.controllers'));

    var scope = null;
    var state = {
      go: function(name, param) {}
    };
    var ctrl = null;
    var parent = {
      list: list,
      save: function(model) {
        return model.$save();
      },
      delete: function(model) {
        return model.$delete();
      }
    };

    beforeEach(inject(function($rootScope, $controller) {
      spyOn(state, 'go');

      scope = $rootScope.$new();
      scope.$parent = parent;
      ctrl = $controller('ModelCtrl', {
        $scope: scope,
        $state: state,
        model: angular.copy(model)
      }); 
    }));

    it("should initialize model", function() {
      expect(scope.model).toEqualData(model);
    });

    it("should save model", function() {
      scope.model.name = "Hello World";
      scope.save(scope.model);

      expect(scope.model).toEqualData(model);
      expect(scope.model.name).toBe("Hello World");
    });

    it("should delete model and go to create state", function() {
      scope.delete(scope.model);

      expect(scope.model.id).toBe(model.id);

      expect(state.go).toHaveBeenCalledWith('model.create');
    });

    it("should create model", function() {
      delete scope.model.id;
      scope.save({"name": "New One"});

      expect(scope.model).toEqualData(model);
      console.log(model);
      //expect(scope.model.name).toBe("Hello World");
    });
  }); // ModelCtrl

});