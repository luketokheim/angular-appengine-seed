'use strict';

describe('Seed filters', function() {
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

  describe('moment_fromNow', function() {
    beforeEach(module('seed.filters'));

    var moment_fromNow = null;
    beforeEach(inject(function(moment_fromNowFilter) {
      moment_fromNow = moment_fromNowFilter;
    }));

    it('should get a list of items', function() {
      expect(moment_fromNow("").toBe(""));
    });
  }); // moment_fromNow

});