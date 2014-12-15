'use strict';

var getTimeOffset = function() {
  return (new Date()).getTimezoneOffset() * 60000;
}

function Event() {
  this.id = null;
  this.leader = null;
  this.location = null;
  this.time = null;
  this.duration = 0;
  this.notes = "";
  this.group = null;
  this.attendees = [];
  this.absentees = [];

  this.setAttendees = function(attendees) {
    if (attendees instanceof Array) {
      var index;
      for (index = 0; index < attendees.length; index++) {
        this.attendees.push(attendees[index].toObject());
      };
    }
  };

  this.setAbsentees = function(absentees) {
    if (absentees instanceof Array) {
      var index;
      for (index = 0; index < absentees.length; index++) {
        this.absentees.push(absentees[i].toObject());
      };
    }
  };

  this.setLeader = function(leader) {
    if (leader) {
      this.leader = leader.toObject();
    }
  };
};

var EventParseObj = Parse.Object.extend("Event", {
  toObject: function() {
    var event = new Event();
    event.id = this.id;
    event.location = this.get("location");
    var GMT_time = this.get("time");
    var offset = getTimeOffset();
    var local_time = GMT_time.getTime() + offset;
    event.time = new Date(local_time);
    event.duration = this.get("duration");
    event.notes = this.get("notes");
    event.group = this.get("group");
    return event;
  }
});

angular.module('transformAppApp')
  .service('EventService', function($q, localStorageService) {
    var eventServiceFunctions = {
      saveEvent: function(event) {
        if (event.id == null) {
          return eventServiceFunctions.createEvent(event);
        } else {
          return eventServiceFunctions.updateEvent(event);
        }
      },
      createEvent: function(event) {
        var deferred = $q.defer();
        var eventParseObj = new EventParseObj();
        var user_pointer = {
          __type:"Pointer",
          className: "_User",
          objectId: event.leader.id
        };
        eventParseObj.set("group", event.group);
        eventParseObj.set("leader", user_pointer);
        eventParseObj.set("location", event.location); 
        eventParseObj.set("time", event.time);
        eventParseObj.set("durationMins", event.duration);
        eventParseObj.set("notes", event.notes);
        eventParseObj.set("attendees", event.absentees);
        eventParseObj.set("absentees", event.absentees);
        eventParseObj.save(null, {
          success: function(eventParseObj) {
            event = eventParseObj.toObject();
            deferred.resolve(event);
          },
          error: function(eventParseObj, error) {
            deferred.reject(error);
          }
        });
        return deferred.promise;
      },
      deleteEvent: function(event_id) {
        var deferred = $q.defer();
        var query = new Parse.Query(EventParseObj);
        query.get(event_id).then(function(eventParseObj) {
          eventParseObj.destroy({
            success: function(myObject) {
              deferred.resolve(true);
            },
            error: function(myObject, error) {
              deferred.reject(error);
            }
          });
        });
        return deferred.promise;
      },
      updateEvent: function(event) {
        var deferred = $q.defer();
        if (event.id == null) {
          deffered.reject("No event ID specified.");
          return deferred.promise;
        }
        var query = new Parse.Query(EventParseObj);
        query.get(event.id).then(function(eventParseObj) {
          // These are the only fields that can be edited right now.
          eventParseObj.set("location", event.location); 
          eventParseObj.set("time", event.time);
          eventParseObj.set("durationMins", event.duration);
          eventParseObj.set("notes", event.notes);
          eventParseObj.save(null,{
            success: function(obj) {
              event = obj.toObject();
              deferred.resolve(event);
            },
            error: function(obj, error) {
              deferred.reject(error);
            }
          });
        });
        return deferred.promise;
      },
      rsvp: function(user_id, event_id, response) {
        var deferred = $q.defer();
        var queue_to_add = null;
        var queue_to_remove = null;
        if (response == 'yes') {
          queue_to_add = 'attendees';
          queue_to_remove = 'absentees';
        } else if (response == 'no') {
          queue_to_remove = 'attendees';
          queue_to_add = 'absentees';
        }
        var query = new Parse.Query(EventParseObj);
        var user_pointer = {
          __type:"Pointer",
          className: "_User",
          objectId: user_id
        };
        // Every time a user responds, we need to do three things in sequence:
        // 1. Add the user to the going/not going queue
        // 2. Remove the user from the not going/going queue
        // 3. Return a list of updated attendees so that we can refresh UI
        var query = new Parse.Query(EventParseObj);
        query.get(event_id).then(function(parseEvent) {
          parseEvent.addUnique(queue_to_add, user_pointer);
          parseEvent.save().then(function(parseEvent) {
            parseEvent.remove(queue_to_remove, user_pointer);
            parseEvent.save().then(function(parseEvent) {
              query = new Parse.Query(EventParseObj);
              query.include('attendees').get(event_id).then(function(parseEvent) {
                var currentEvent = parseEvent.toObject();
                currentEvent.setAttendees(parseEvent.get("attendees"));                
                deferred.resolve(currentEvent);
              }, function(error){
                deferred.reject(error);
              })
            }, function(error){
              deferred.reject(error);
            });
          }, function(error) {
            deferred.reject(error);
          })
        }, function(error) {
          deferred.reject(error);
        });
        return deferred.promise;
      },

      loadUpcomingEvent: function(group_id) {
        var deferred = $q.defer();
        var query = new Parse.Query(EventParseObj);
        var current_time = new Date();
        var offset = getTimeOffset();
        current_time.setTime(current_time.getTime() - offset);
        // Parse Date object comparison works with a Date object.
        query.greaterThanOrEqualTo("time", current_time);
        query.equalTo("group", group_id);
        query.ascending("time");
        query.include("attendees").include("leader").first({
          success: function(parseEvent) {
            if (!parseEvent) {
              deferred.resolve(null);
            } else {
                var currentEvent = parseEvent.toObject();
                currentEvent.setAttendees(parseEvent.get("attendees"));   
                currentEvent.setLeader(parseEvent.get("leader"));             
                deferred.resolve(currentEvent);
            }
          },
          error: function(error) {
            deferred.reject(error);
          }
        });
        return deferred.promise;
      },
    };
    return eventServiceFunctions;
  });