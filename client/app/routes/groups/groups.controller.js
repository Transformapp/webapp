'use strict';

angular.module('transformAppApp')
  .controller('GroupsCtrl', function ($scope, localStorageService, UserService, GroupService) {
    var current_user = UserService.currentLoggedInUser();
    var group_id = null;
    if (current_user.groups instanceof Array && current_user.groups.length >= 1) {
      group_id = current_user.groups[0];
      var group = localStorageService.get(group_id);
      $scope.group = group;
      $scope.isAdmin = GroupService.isAdmin(current_user, group);
  
      $scope.updateGroup = function() {
        group['description'] = $scope.groupDetails.groupDescription;
        group['name'] = $scope.groupDetails.groupName;
  
        GroupService.updateGroup(group_id, group);
  
        // update UI to match change in backend
        $scope.groupName = $scope.groupDetails.groupName;
        $scope.groupDescription = $scope.groupDetails.groupDescription;
        // clear input boxes
        $scope.groupDetails.groupName = '';
        $scope.groupDetails.groupDescription = '';
      };
    } else {
      alert('User does not belong to any group');
    }
  })
  .controller('GroupJoinCtrl', function ($scope, $rootScope, UserService, GroupService, $stateParams, $state) {
    var group_id = null;
    if ($stateParams.id) {
      $rootScope.groupToJoin = $stateParams.id;
    }
    if ($rootScope.groupToJoin) {
      group_id = $rootScope.groupToJoin;
    }
    if (group_id == null) {
      alert("Group ID can't be null for group join request.");
    }
    var current_user = UserService.currentLoggedInUser();
    if (!current_user) {
      // Set this so after auth we know what to do.
     	$state.go("auth");  // user not authenticated, re-route them to auth
    } else {
      UserService.addUserToGroup(current_user, group_id).then(function(user) {
        GroupService.addUserToGroup(user.id, group_id).then(function(group) {
          $rootScope.groupToJoin = null;
          $state.go("events");
        }, function (error) {
          alert(error);
        });
      }, function(error) {
        alert(error);
      })
    }
  });



