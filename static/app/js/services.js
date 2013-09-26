'use strict';

// Implements RESTful interaction on the client side. Wrappers around the
// lower level HTTP calls. Implemented as an Angular ngResource module.
angular.module('seed.services', ['ngResource'])
  .factory('Model', ['$resource', 'Config', function($resource, Config) {
    return $resource([Config.api_url, ':id'].join('/'), {id: '@id'}, {
      // Query returns an object with paging tokens and an array named
      // 'items'. ngResource expects a simple array by default. The defaults
      // work for the other methods (read, save, delete).
      query: {method: 'GET', isArray: false, params: {limit: Config.list_limit}}
    });
  }]);