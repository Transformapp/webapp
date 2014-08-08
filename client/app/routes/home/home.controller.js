'use strict';

angular.module('transformAppApp')
  .controller('HomeCtrl', function ($scope, $rootScope, UserService, $state, localStorageService, $window) {
    // check for user login
    $rootScope.currentUser = UserService.currentLoggedInUser();
    event.preventDefault();
    if (!$rootScope.currentUser) {
      $state.go("auth");  // user not authenticated, re-route them to auth
    } else if ($rootScope.previousState == "auth") {
      $state.go("events"); // user is either just authenticated or came here for the first time, default to /events.
    }
    $scope.invite = function(){
      if ($rootScope.currentUser.groups.length < 1) {
        alert("User has to be in a group to invite friends to group.");
      } else {
        var baseURL = 'http://transform-app.herokuapp.com/';
        var group = $rootScope.currentUser.groups[0];
        var groupLink = 'groups/join/'+group.id;
        var bodyText = 'Join our small group by clicking this link: '+baseURL+groupLink;
        var link = "mailto:"+''
                 + "?subject=" + escape("Join our Small Group with Transform!")
                 + "&body=" + bodyText;
        $window.location.href = link;
      }
    }
  });
