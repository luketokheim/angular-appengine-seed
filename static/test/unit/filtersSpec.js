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

    it('should parse the date format used by the API', function() {
      var date = '2013-10-03T00:31:24.923000';
      expect(moment_fromNow(date)).toBeDefined();
      expect(moment_fromNow(date)).not.toBe('a few seconds ago');
    });
  }); // moment_fromNow

});