'use strict';

angular.module('transformAppApp')
  .controller('AuthCtrl', function ($scope, $state, $rootScope, UserService) {
  $scope.login = function () {
    var promise = UserService.authenticate();
    promise.then(function(user) {
      if (!$rootScope.groupToJoin) {
        $state.go('events');
      } else {
        $state.go('groupJoin');
      }
    }, function(error) {
      alert('authentication aborted: ' + error);
    });
  };
});
