'use strict';

angular.module('seed.filters', []).
  filter('moment_fromNow', function() {
    return function(value) {
      return moment.utc(value).fromNow();
    };
  });