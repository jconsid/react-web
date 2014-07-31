'use strict';

/* jasmine specs for services go here */

describe('controllers', function() {
  beforeEach(module('poa'));
/* .controller('AnmalanCtrl', ['$scope', 'AnmalanService', '$routeParams', 'PersonService', '$location', 'flash',
    function($scope, anmalanService, $routeParams, personService, $location, flash) { */
  describe('AnmalanCtrl', function() {
    var scope, ctrl, flashMsg, locationParam;

    beforeEach(inject(function($controller, $rootScope) {
      var mockedPersonService = {
        isInitialized: function() {
          return true;
        },
        getUsername:function(){
          return 'ghandi';
        }
      };

      var mockedAnmalanService = {
        findOne: function(anmalanId, fn) {
        }
      };

      var mockedLocation = {
        path: function(p0) {
          locationParam = p0;
        }
      };

      flashMsg = null;
      var mockedFlashService = {
        setMessage:function(msg) {
          flashMsg = msg;
        }
      };

      scope = {'ticket': {'_id':'22'}};

      ctrl = $controller('AnmalanCtrl', {
        $scope: scope,
        AnmalanService: mockedAnmalanService,
        $routeParams: {},
        PersonService: mockedPersonService,
        $location: mockedLocation,
        flash: mockedFlashService});
    }));

    it('should navigate on gotoEdit', function() {
      ctrl.gotoEdit();
      expect(locationParam).toBeDefined();


    });
  });

});