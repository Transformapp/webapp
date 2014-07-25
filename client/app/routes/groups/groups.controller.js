'use strict';

angular.module('transformAppApp')
  .controller('GroupsCtrl', function ($scope, localStorageService, UserService, GroupService) {
    var group = localStorageService.get(currentGroupId);
    var current_user = UserService.currentLoggedInUser();
    $scope.group = group;
    $scope.isAdmin = GroupService.isAdmin(current_user, group);

    $scope.updateGroup = function() {
      group['description'] = $scope.groupDetails.groupDescription;
      group['name'] = $scope.groupDetails.groupName;

      GroupService.updateGroup(currentGroupId, group);

      // update UI to match change in backend
      $scope.groupName = $scope.groupDetails.groupName;
      $scope.groupDescription = $scope.groupDetails.groupDescription;
      // clear input boxes
      $scope.groupDetails.groupName = '';
      $scope.groupDetails.groupDescription = '';
    };

  });



