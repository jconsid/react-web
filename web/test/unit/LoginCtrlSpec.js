'use strict';

/* jasmine specs for services go here */

describe('controllers', function() {
  beforeEach(module('myApp'));

  describe('LoginCtrl', function() {
    var scope, ctrl, mockedGlobal, mockedLoginService;

    beforeEach(inject(function($controller, $rootScope) {
      mockedGlobal = {
        writtenUsername:"",
        getUser: function(){return "ghandi"},
        setUser: function(uname){this.writtenUsername = uname}
      };

      mockedLoginService = {
        login:function(a, b) {
          var promise = $.Deferred();
          promise.resolve();
          return promise;
        }
      }

      scope = $rootScope.$new();
      ctrl = $controller('LoginCtrl', {
        $scope: scope,
        global:mockedGlobal,
        LoginService: mockedLoginService});
    }));

    it('should assign username to global AND to $scope', function() {
      scope.login();
      expect(scope.username).toBe('ghandi');
      expect(mockedGlobal.writtenUsername).toBe('ghandi');
    });
  });

});