'use strict';

describe('Seed app', function() {

  describe('Config', function() {
    beforeEach(module('seed'));

    var Config = null;
    beforeEach(inject(function($injector) {
      Config = $injector.get('Config');
    }));

    it('should define api_url', function() {
      expect(Config.api_url).toBeDefined();
    });

    it('should define debug', function() {
      expect(Config.debug).toBeDefined();
    });

    it('should define list_limit', function() {
      expect(Config.list_limit).toBeDefined();
    });

    it('should define version', function() {
      expect(Config.version).toBeDefined();
    });    
  }); // Config

  describe('App', function() {
    beforeEach(module('seed'));

    var $rootScope;
    beforeEach(inject(function($injector) {
      $rootScope = $injector.get('$rootScope');
    }));

    it('should define root scope', function() {
      expect($rootScope).toBeDefined();
    });

    it('should define $state in root scope', function() {
      expect($rootScope.$state).toBeDefined();
    });

    it('should define $stateParams in root scope', function() {
      expect($rootScope.$stateParams).toBeDefined();
    });

    it('should define $config in root scope', function() {
      expect($rootScope.$config).toBeDefined();
      expect($rootScope.$config.api_url).toBeDefined();
    });
  }); // App

});