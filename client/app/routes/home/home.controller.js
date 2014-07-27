'use strict';

angular.module('transformAppApp')
  .controller('HomeCtrl', function ($scope, $rootScope, UserService, $state) {
    $rootScope.currentUser = UserService.currentLoggedInUser();
    if (!$rootScope.currentUser) {
      event.preventDefault();
      $state.go("auth");
    }
  });
