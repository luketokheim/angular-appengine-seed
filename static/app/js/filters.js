'use strict';

// Filters are used for display formatting in templates. Transform a variable
// into human readable format.
angular.module('seed.filters', []).
  // Use the really cool Moment.js library to display a timestamp in a format
  // like "5 days ago" or "8 minutes ago".
  filter('moment_fromNow', function() {
    return function(value) {
      // Trim off anything thing less than a second.
      var idx = value.lastIndexOf('.');
      if (idx >= 0) {
        value = value.substring(0, idx);
      }

      return moment.utc(value).fromNow();
    };
  });