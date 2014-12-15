'use strict';

angular.module('transformAppApp')
  .controller('EventsCtrl', function (
    $scope, localStorageService, UserService, EventService, GroupService) {
    $(".loading").show();
  
    var current_user = UserService.currentLoggedInUser();
  
    UserService.loadUserGroupAndMembers().then(function(group) {
      var current_group_id = group.id;
      // Check if current user is admin of group. This determins if the user
      // can create a new event.
      $scope.is_admin = GroupService.isAdmin(current_user, group);
      if (current_group_id) {
        EventService.loadUpcomingEvent(current_group_id).then(function(event) {
          $scope.has_event = (event != null);
          $scope.event = event;
          // We only allow the group leader to edit an event.
          if (event.leader.id == current_user.id) {
            $scope.can_edit = $scope.is_admin;
          } else {
            $scope.can_edit = false;
          }
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
  })
  .controller('SaveEventCtrl', function($scope, $state, $stateParams, EventService, UserService) {
    // Set up date picker
    $scope.date = new Date();
    $scope.minDate = new Date();
    
    // Set up time picker
    $scope.time = new Date();
    var min = $scope.time.getMinutes();
    // We want the initial min to be a integer multiple of 15.
    min = Math.floor(min/15)*15;
    $scope.time.setMinutes(min);

    $scope.hstep = 1;
    $scope.mstep = 15;
    $scope.ismeridian = true;

    $scope.saveEvent = function() {
      UserService.loadUserGroupAndMembers().then(function(group) {
        var time = $scope.time;
        var date = $scope.date;
        var offset = (new Date()).getTimezoneOffset() * 60000;
        date.setHours(time.getHours());
        date.setMinutes(time.getMinutes());
        date.setSeconds(0);
        date.setTime(date.getTime() - offset);
        var event = new Event();
        event.id = $stateParams.id == null ? null : $stateParams.id;
        event.time = date;
        event.group = group.id;
        event.duration = $scope.duration ? $scope.duration : null;
        event.leader = UserService.currentLoggedInUser();
        event.location = $scope.location;
        event.attendees = [];
        event.absentees = [];
        event.notes = $scope.notes;
        EventService.saveEvent(event).then(function(event) {
          $state.go("events");
        }, function(error) {
          alert("Error saving the event: " + error);
        })
      }), function(error) {
        alert("Error saving the event: " + error);
      }
    };
  });
