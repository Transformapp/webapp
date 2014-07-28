'use strict';

angular.module('transformAppApp')
  .controller('HomeCtrl', function ($scope, $rootScope, UserService, $state) {
  	// check for user login
    $rootScope.currentUser = UserService.currentLoggedInUser();
   	event.preventDefault();
    if (!$rootScope.currentUser) {
     	$state.go("auth");  // user not authenticated, re-route them to auth
    }
    else if ($rootScope.previousState == "auth") {
    	$state.go("events"); // user is either just authenticated or came here for the first time, default to /events
    }
  });
