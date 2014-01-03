'use strict';

describe('Seed controllers', function() {
  // Canned data for the list controller.
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

  // Create ngResource method wrappers per item.
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
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

    list[i] = item;
  }

  // Canned data for the model (single item) controller.
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
        list: angular.copy(list)
      });
    }));

    it('should initialize list', function() {
      expect(scope.list).toEqualData(list);
    });

    it('should load list', function() {
      expect(scope.list).toEqualData(list);
    });

    it('should find item 1 in list', function() {
      expect(scope.indexOf(model.id)).toBe(0);
    });

    it('should add item to list', function() {
      var create_model = angular.copy(model);
      delete create_model.id;
      create_model.name = "Item Three";

      expect(scope.indexOf(model.id)).toBe(0);
      expect(scope.indexOf(create_model.id)).toBe(-1);
      expect(scope.list.length).toBe(2);
      scope.save(create_model);
      expect(scope.list.length).toBe(3);
      expect(scope.indexOf(create_model.id)).toBe(0);
      expect(scope.indexOf(model.id)).toBe(1);
    });

    it('should remove item 1 from list', function() {
      expect(scope.list.length).toBe(2);
      scope.remove(model);
      expect(scope.list.length).toBe(1);
      expect(scope.indexOf(model.id)).toBe(-1);
    });

    it('it should remove all items from list', function() {
      var list_copy = angular.copy(list);
      for (var i=0; i<list_copy.length; i++) {
        scope.remove(list_copy[i]);
      }

      expect(scope.list.length).toBe(0);
    });

    it('should update item 1 in list', function() {
      expect(scope.list.length).toBe(2);
      model.name = "Hello World";
      scope.save(model);
      expect(scope.list.length).toBe(2);

      expect(scope.list[0].name).toBe("Hello World");
      expect(scope.list[0]).toEqualData(model);
    });
  }); // ListCtrl

  describe('ModelCtrl', function() {
    beforeEach(module('seed.controllers'));

    var scope = null;
    var state = {
      params: {id: model.id},
      go: function(name, param) {},
      save: function() {},
      remove: function() {}
    };
    var ctrl = null;
    var parent = {
      list: list,
      save: function(model) {
        state.save();
        return model.$save();
      },
      remove: function(model) {
        state.remove();
        return model.$delete();
      },
      indexOf: function(id) {
        if (model.id === id) {
          return 0;
        } else {
          return -1;
        }
      }
    };

    // First option. Copy initial data from the parent list.
    beforeEach(inject(function($rootScope, $controller) {
      scope = $rootScope.$new();
      scope.$parent = parent;
      ctrl = $controller('ModelCtrl', {
        $scope: scope,
        $state: state,
        model: null
      }); 
    }));

    it("should initialize model without resolve", function() {
      expect(scope.model).toEqualData(model);
    });

    // Second option. Make separate ngResource call and object for the 
    // initial data.
    beforeEach(inject(function($rootScope, $controller) {
      spyOn(state, 'go');
      spyOn(state, 'save');
      spyOn(state, 'remove');

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

    it("should initialize parent", function() {
      expect(scope.$parent.list).toEqualData(list);
    });

    it("should load model from parent list", function() {
      expect(scope.$parent.list[0]).toEqualData(scope.model);
    });

    it("should save model", function() {
      scope.model.name = "Hello World";
      scope.save(scope.model);

      expect(scope.model).toEqualData(model);
      expect(scope.model.name).toBe("Hello World");
      expect(state.save).toHaveBeenCalled();
    });

    it("should delete model and go to create state", function() {
      scope.remove(scope.model);

      expect(scope.model.id).toBe(model.id);

      expect(state.remove).toHaveBeenCalled();
      expect(state.go).toHaveBeenCalledWith('model.create');
    });

    it("should create model", function() {
      var create_model = angular.copy(model);
      delete create_model.id;
      create_model.name = "Item Three";

      scope.save(create_model);

      expect(state.save).toHaveBeenCalled();
    });
  }); // ModelCtrl

});