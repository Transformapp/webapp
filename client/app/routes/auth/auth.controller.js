'use strict';

angular.module('transformAppApp')
  .controller('AuthCtrl', function ($scope, $state, UserService) {
	$scope.login = function () {
		var promise = UserService.authenticate();
		promise.then(function(user) {
			$state.go('events');
	    }, function(error) {
	      alert('authentication aborted: ' + error);
	    });
	};
  });
