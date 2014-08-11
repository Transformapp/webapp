'use strict';

angular.module('transformAppApp')
  .controller('EventsCtrl', function ($scope, localStorageService, UserService, EventService) {
  $(".loading").show();

	var current_user = UserService.currentLoggedInUser();
	// Check if current user is admin of group.
	$scope.is_admin = true;

  UserService.loadUserGroupAndMembers().then(function(group) {
    var current_group_id = group.id;
    if (current_group_id) {
      EventService.loadUpcomingEvent(current_group_id).then(function(event) {
        $scope.has_event = (event != null);
        $scope.event = event;
        $scope.user_is_attending = null;
        for (var i = 0; i < event.attendees.length; i ++) {
          var user = event.attendees[i];
          if (UserService.isCurrentUser(user)) {
            document.getElementById('yes_button').className = 'rsvpButtonTextSelected';
            document.getElementById('no_button').className = 'rsvpButtonTextUnselected';
            $scope.user_is_attending = true;
            break;
          }
        }
        if ($scope.user_is_attending == null) {
          for (var i = 0; i < event.absentees.length; i ++) {
            if (UserService.isCurrentUser(event.absentees[i])) {
              document.getElementById('yes_button').className = 'rsvpButtonTextUnselected';
              document.getElementById('no_button').className = 'rsvpButtonTextSelected';
              $scope.user_is_attending = false;
              break;
            }
          }
        }
      }, function(error) {
        alert('Failed to load upcoming event: ' + error);
      });
    } else {
      alert('User is not part of any group.');
    }
  }, function(error) {
    alert(error);
  });

  $scope.createEvent = function() {
    
  };

  $scope.rsvp = function(response) {
    EventService.rsvp(current_user.id, $scope.event.id, response).then(function(event) {
        $scope.event.attendees = event.attendees;
        if (response == 'yes') {
          document.getElementById('yes_button').className = 'rsvpButtonTextSelected';
          document.getElementById('no_button').className = 'rsvpButtonTextUnselected';
        } else if (response == 'no') {
          document.getElementById('no_button').className = 'rsvpButtonTextSelected';
          document.getElementById('yes_button').className = 'rsvpButtonTextUnselected';
        }
    }, function(error) {
        alert('Failed to RSVP: ' + error);
    });
  };

  $scope.title = "My group";
});
