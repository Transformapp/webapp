'use strict';

angular.module('transformAppApp')
  .controller('ProfileCtrl', function ($scope, UserService) {
	  $(".loading").hide();
	  $scope.user = UserService.currentLoggedInUser();
	  $scope.title = "Profile Page";
    $scope.logOut = function() {
      UserService.logout();
    }
  });
