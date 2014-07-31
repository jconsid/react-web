'use strict';

/* jasmine specs for services go here */

describe('service', function() {
  beforeEach(module('poa.services'));

  describe('TimeDisplayService', function() {
    /* dagar */

    it('should tell "dagar" when called with a date five days ago',
    		inject(function(TimeDisplayService) {
    	var myDate=new Date();
		myDate.setDate(myDate.getDate()-5);
      	expect(TimeDisplayService.timeSince(myDate)).toEqual('5 dagar');
    }));

    it('should tell "en dag" when called with a date one day ago',
    		inject(function(TimeDisplayService) {
    	var myDate=new Date();
		myDate.setDate(myDate.getDate()-1);
      	expect(TimeDisplayService.timeSince(myDate)).toEqual('en dag');
    }));
    /* timmar */
    it('should tell "timmar" when called with a date five hours ago',
    		inject(function(TimeDisplayService) {
    	var now=new Date();
    	var fiveHoursAgo=new Date(now - (1000 * 60 * 60 * 5));

      	expect(TimeDisplayService.timeSince(fiveHoursAgo)).toEqual('5 timmar');
    }));

    it('should tell "timme" when called with a date one hour ago',
    		inject(function(TimeDisplayService) {
    	var now=new Date();
    	var fiveHoursAgo=new Date(now - (1000 * 60 * 60 * 1));

      	expect(TimeDisplayService.timeSince(fiveHoursAgo)).toEqual('en timme');
    }));

    /* minuter */
    it('should tell "minuter" when called with a date two minutes ago',
        inject(function(TimeDisplayService) {
      var now=new Date();
      var fiveHoursAgo=new Date(now - (1000 * 60 * 2));

        expect(TimeDisplayService.timeSince(fiveHoursAgo)).toEqual('2 minuter');
    }));

    it('should tell "minut" when called with a date one minute ago',
        inject(function(TimeDisplayService) {
      var now=new Date();
      var fiveHoursAgo=new Date(now - (1000 * 60 * 1));

        expect(TimeDisplayService.timeSince(fiveHoursAgo)).toEqual('en minut');
    }));

    /* sekunder */
    it('should tell "sekunder" when called with a date two seconds ago',
        inject(function(TimeDisplayService) {
      var now=new Date();
      var fiveHoursAgo=new Date(now - (1000 * 2));

        expect(TimeDisplayService.timeSince(fiveHoursAgo)).toEqual('2 sekunder');
    }));

    it('should tell "sekund" when called with a date one second ago',
        inject(function(TimeDisplayService) {
      var now=new Date();
      var fiveHoursAgo=new Date(now - 1000);

      expect(TimeDisplayService.timeSince(fiveHoursAgo)).toEqual('en sekund');
    }));


    it('should return null when called with a date 0 seconds ago',
        inject(function(TimeDisplayService) {
      var now=new Date();

      expect(TimeDisplayService.timeSince(now)).toBeNull();
    }));
  });


});
