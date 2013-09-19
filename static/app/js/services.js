'use strict';

angular.module('seed.services', ['ngResource'])
  .factory('Model', ['$resource', function($resource) {
    return $resource('/_ah/api/seed/v1/model/:id', {id: '@id'}, {
      // Query returns an object with paging tokens and an array named 'items'.
      // ngResource expects a simple array by default. The defaults work for
      // the other methods.
      query: {method: 'GET', isArray: false, params: {limit: 10}}
  }]);