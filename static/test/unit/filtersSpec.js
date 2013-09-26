'use strict';

describe('Seed filters', function() {
  describe('moment_fromNow', function() {
    beforeEach(module('seed.filters'));

    var moment_fromNow = null;
    beforeEach(inject(function(moment_fromNowFilter) {
      moment_fromNow = moment_fromNowFilter;
    }));

    it('should format the date as "a few seconds ago"', function() {
      var date = moment().subtract('second', 1).toISOString();
      expect(moment_fromNow(date)).toBe('a few seconds ago');
    });

    it('should format the date as "7 days ago"', function() {
      var date = moment().subtract('day', 7).toISOString();
      expect(moment_fromNow(date)).toBe('7 days ago');
    });

    it('should format the date as "a year ago"', function() {
      var date = moment().subtract('year', 1).toISOString();
      expect(moment_fromNow(date)).toBe('a year ago');
    });
  }); // moment_fromNow

});