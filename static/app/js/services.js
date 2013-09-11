'use strict';

angular.module('seed.services', ['ngResource'])
  .factory('Model', ['$resource', function($resource) {
    return $resource('/_ah/api/seed/v1/model/:verb/:id', {id: '@id'}, {
      // Query returns an object with paging tokens and an array named 'items'.
      // ngResource expects a simple array by default.
      query: {method: 'GET', isArray: false, params: {limit: 5}}
    });
  }]);