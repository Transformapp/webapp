'use strict';

function Event() {
  this.id = null;
  this.leader = null;
  this.location = null;
  this.time = null;
  this.duration = 0;
  this.notes = "";
  this.attendees = [];
  this.absentees = [];
};

var EventParseObj = Parse.Object.extend("Event", {
  toObject: function() {
    var event = new Event();
    event.id = this.id;
    event.leader = this.get("leader").toObject();
    event.location = this.get("location");
    event.time = this.get("time");
    event.duration = this.get("duration");
    event.notes = this.get("notes");
    event.attendees = [];
    event.absentees = [];
    this.get("attendees").forEach(function(parse_user) {
      event.attendees.push(parse_user.toObject());
    });
    this.get("absentees").forEach(function(parse_user) {
      event.absentees.push(parse_user.toObject());
    });
    return event;
  }
});

angular.module('transformAppApp')
  .service('EventService', function($q, localStorageService) {
    var eventServiceFunctions = {
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
                deferred.resolve(parseEvent.toObject());
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
        var date = new Date();
        var time = new Date(date.getTime());
        // Parse Date object comparison only works if we initialize JS Date with
        // currentDate.getTime().
        query.greaterThan("time", new Date(date.getTime()));
        query.equalTo("group", group_id);
        query.ascending("time");
        query.include("attendees").include("leader").first({
          success: function(parseEvent) {
            if (!parseEvent) {
              deferred.resolve(null);
            } else {
              // Successfully retrieved the object.
              deferred.resolve(parseEvent.toObject());
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