'use strict';

describe('Seed', function() {
  describe('List view', function() {
    it('should redirect to the list view by default', function() {
      browser().navigateTo('/');
      
      expect(browser().location().url()).toBe('/model');
    });

    it('should display an "Add Item" button', function() {
      element("button", "Add Item").click();
      
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
  }); /// Detail view

});