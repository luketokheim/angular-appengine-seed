'use strict';

describe('Seed services', function() {
  // Canned data for List + CRUD operations.
  var list = {
    items: [
      {"created": "2013-09-19T15:31:48.906000", "id": "1", "name": "Item One"},
      {"created": "2013-09-18T23:21:57.529000", "id": "2", "name": "Item Two"},
    ]
  };
  var model = list.items[0];
  var update_model = model;
  update_model.name = "Updated Name";
  var create_model =
    {"created": "2013-09-20T12:02:10.128000", "id": "3", "name": "Item Three"};

  beforeEach(function() {
    this.addMatchers({
      toEqualData: function(expected) {
        return angular.equals(this.actual, expected);
      }
    });
  });

  describe('Model', function() {
    beforeEach(module('seed.services'));

    var MockConfig = {
      api_url: '/api'
    };
    var Model = null;
    var $httpBackend = null;

    beforeEach(module(function($provide) {
      $provide.constant('Config', MockConfig);
    }));

    beforeEach(inject(function($injector) {
      Model = $injector.get('Model');

      $httpBackend = $injector.get('$httpBackend');
      // Query.
      $httpBackend.
        when('GET', [MockConfig.api_url, 'limit=5'].join('?')).
        respond(200, list);
      // Create.
      $httpBackend.
        when('POST', MockConfig.api_url).
        respond(200, create_model);
      // Read.
      $httpBackend.
        when('GET', [MockConfig.api_url, model.id].join('/')).
        respond(200, model);
      // Update.
      $httpBackend.
        when('POST', [MockConfig.api_url, model.id].join('/'), update_model).
        respond(200, update_model);
      // Delete.
      $httpBackend.
        when('DELETE', [MockConfig.api_url, model.id].join('/')).
        respond(200, {id: model.id});
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should get a list of items', function() {
      var data = Model.query();
      $httpBackend.flush();

      expect(data).toEqualData(list);
    });

    it('should create an item', function() {
      var data = Model.save();
      $httpBackend.flush();

      expect(data).toEqualData(create_model);
    });

    it('should read an item by id', function() {
      var data = Model.get({id: model.id});
      $httpBackend.flush();

      expect(data).toEqualData(model);
    });

    it('should update an item by id', function() {
      var data = Model.save(update_model);
      $httpBackend.flush();

      expect(data).toEqualData(model);
    });

    it('should delete an item by id', function() {
      var data = Model.delete({id: model.id});
      $httpBackend.flush();

      expect(data).toEqualData({id: model.id});
    });

    it('should get a list with Model.$query method', function() {
      var data = Model.query();
      $httpBackend.flush();

      expect(data).toEqualData(list);

      list.items.push(create_model);
      data.$query();
      $httpBackend.flush();

      expect(data).toEqualData(list);
    });

    it('should create with Model.$save method', function() {
      var data = new Model();
      data.name = create_model.name;

      data.$save();
      $httpBackend.flush();

      expect(data).toEqualData(create_model);      
    });

    it('should update with Model.$save method', function() {
      var data = Model.get({id: model.id});
      $httpBackend.flush();

      expect(data).toEqualData(model);

      data.name = update_model.name;
      data.$save();
      $httpBackend.flush();

      expect(data).toEqualData(update_model);      
    });

    it('should delete with Model.$delete method', function() {
      var data = Model.get({id: model.id});
      $httpBackend.flush();

      expect(data).toEqualData(model);

      data.$delete();
      $httpBackend.flush();

      expect(data).toEqualData({id: model.id});      
    });
  }); // Model

});