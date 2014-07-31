'use strict';

/* jasmine specs for services go here */

describe('controllers', function() {
  beforeEach(module('poa'));

  describe('LoginCtrl', function() {
    var scope, ctrl, mockedGlobal, mockedLoginService, flashMsg;

    beforeEach(inject(function($controller, $rootScope) {
      mockedGlobal = {
        writtenUsername:"",
        getUser: function(){return "ghandi"},
        setUser: function(uname){this.writtenUsername = uname}
      };

      mockedLoginService = {
        login:function(a, b) {
          var promise = $.Deferred();
          promise.resolve({username:'ghandi', person: {firstname:'Mahatma', lastname:'Ghandi'}, organisation: {}});
          return promise;
        }
      }

      flashMsg = null;
      var mockedFlashService = {
        setMessage:function(msg) {
          flashMsg = msg;
        }
      }

      scope = $rootScope.$new();
      ctrl = $controller('LoginCtrl', {
        $scope: scope,
        global:mockedGlobal,
        LoginService: mockedLoginService,
        flash: mockedFlashService});
    }));
/*            flash.setMessage('Du är inloggad som ' + personAggr.person.firstname + ' ' + personAggr.person.lastname + ' (' + $scope.username + ')');
            console.log("Inloggad", personAggr);
            $location.path("/list");*/
    it('should assign username to global AND to $scope', function() {
      scope.username = 'ghandi';
      scope.login();
      expect(flashMsg).toBe('Du är inloggad som Mahatma Ghandi (ghandi)');
    });
  });

});