'use strict';

// Implements RESTful interaction on the client side. Wrappers around the
// lower level HTTP calls. Implemented as an Angular ngResource module.
// Customized for compatibility with a Google Cloud Endpoint.
angular.module('seed.services', ['ngResource'])
  .factory('Model', ['$resource', 'Config', function($resource, Config) {
    return $resource([Config.api_url, ':id'].join('/'), {id: '@id'}, {
      // Query App Engine returns an object with paging tokens and an array
      // named 'items'. ngResource expects a simple array by default.
      'query': {
        method: 'GET',
        isArray: true,
        params: {limit: Config.list_limit},
        transformResponse: function(data, headersGetter) {
          var obj = angular.fromJson(data);
          if ('items' in obj) {
            return obj.items;
          } else {
            return [];
          }
        }
      },
      // The default ngResource delete sends the object data in the request
      // body. This is not supported on the App Engine. Filter it out manually.
      'delete': {
        method: 'DELETE',
        transformRequest: function(data, headersGetter) {
          return null;
        }
      }
    });
  }]);