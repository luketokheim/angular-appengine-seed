'use strict';

describe('Seed', function() {

  describe('List view', function() {
    it('should redirect to the list view by default', function() {
      browser().navigateTo('/');
      
      expect(browser().location().url()).toBe('/model');
    });

    it('should display an "Add Item" link', function() {
      element("a[href='#/model/create']", "Add Item").click();
      
      expect(browser().location().url()).toBe('/model/create');
    });
  }); // List view

  describe('Detail view', function() {
    it('should create an item and go to its detail view', function() {
      browser().navigateTo('/#/model/create');

      expect(browser().location().url()).toBe('/model/create');
      expect(repeater('.btn-primary').count()).toEqual(1);

      input('model.name').enter('Hello World ' + Math.random());
      element('.btn-primary').click();

      expect(browser().location().url()).toMatch(/\/model\/\d+/);
    });

    it('should edit and item and stay in its detail view', function() {
      //browser().navigateTo('/#/model/5051225137479680');
      //var future = repeater('a[ui-sref]').count();
      //console.log(future);
      //var url = future.execute(function(value) { return value; });
      //console.log(url);

      input('model.name').enter('I changed my mind...');
      element('.btn-primary').click();

      expect(binding('model.name')).toBe('I changed my mind...');

      //expect(browser().location().url()).toBe(url);
      //expect(browser().location().url()).toBe(url);
    });

    it('should highlight one item in the list', function() {
      expect(repeater('a.list-group-item[ng-repeat]').count()).
        toBeGreaterThan(0);
      //expect(repeater('a.list-group-item[ng-repeat]').count()).
      //  toBeLessThan(6);
      expect(repeater('a.list-group-item.active[ng-repeat]').count()).
        toBe(1);
    });
  }); // Detail view

});