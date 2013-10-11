'use strict';

describe('Seed directives', function() {
  var MockConfig = {
    api_url: '/api/mock'
  };

  beforeEach(module(function($provide) {
    $provide.constant('Config', MockConfig);
  }));

  describe('seedHref', function() {
    beforeEach(module('seed.directives'));

    var element = null;
    var scope = null;

    beforeEach(inject(function($rootScope, $compile) {
      element = angular.element('<a seed-href="{{id}}">Link Text</a>');

      scope = $rootScope;
      $compile(element)(scope);
      scope.$digest();
    }));

    it('should set the href of the element to the API url, no id', function() {
      expect(element.text()).toBe('Link Text');
      expect(element.attr('href')).toBe(MockConfig.api_url);
    });

    it('should set the href of the element to the API url, with id', function() {
      scope.$apply(function() {
        scope.id = '1';
      });

      expect(element.text()).toBe('Link Text');
      expect(element.attr('href')).toBe([MockConfig.api_url, '1'].join('/'));
    });
  }); // seedHref

  describe('seedApi', function() {
    beforeEach(module('seed.directives'));

    var element = null;
    var scope = null;

    beforeEach(inject(function($rootScope, $compile) {
      element = angular.element('<span seed-api="{{id}}"></span>');

      scope = $rootScope;
      $compile(element)(scope);
      scope.$digest();
    }));

    it('should set the text value of the element to the API url, no id', function() {
      expect(element.text()).toBe(MockConfig.api_url);
    });

    it('should set the text value of the element to the API url, with id', function() {
      scope.$apply(function() {
        scope.id = '1';
      });

      expect(element.text()).toBe([MockConfig.api_url, '1'].join('/'));
    });
  }); // seedApi

});