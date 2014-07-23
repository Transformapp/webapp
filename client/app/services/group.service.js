'use strict';

function Group() {
  this.id = null;
  this.name = "";
  this.startTime = null;
  this.durationMins = 0;
  this.users = [];
  this.description = "";
  this.admins = [];
};

var GroupParseObj = Parse.Object.extend("Group", {
  toObject: function() {
    var obj = new Group();
    obj.id = this.id;
    obj.name = this.get("name");
    obj.startTime = this.get("startTime");
    obj.durationMins = this.get("durationMins");
    obj.location = this.get("location");
    obj.description = this.get("description");
    this.get("users").forEach(function(parseUser) {
      obj.users.push(parseUser.toObject());
    });
    this.get("admins").forEach(function(parseUser) {
      obj.admins.push(parseUser.toObject());
    });
    return obj;
  }
});

angular.module('transformAppApp')
  .service('GroupService', function($q, localStorageService) {
    var groupServiceFunctions = {
      loadGroup: function(id) {
        var deferred = $q.defer();
        var query = new Parse.Query(GroupParseObj);      
        query.include("users").include("admins").get(id).then(function(parseGroup) {
          var group = parseGroup.toObject();
          deferred.resolve(group);
        }, function(error){
          deferred.reject(error);
        });
        return deferred.promise;
      },
      updateGroup: function(id, newGroup){
        var deferred = $q.defer();
        var queryForGroup = new Parse.Query(GroupParseObj);
        queryForGroup.get(id).then(function(group) {
          group.set('id', newGroup['id']);
          group.set('name', newGroup['name']);
          group.set('startTime', newGroup['startTime']);
          group.set('durationMins', newGroup['durationMins']);
          group.set('description', newGroup['description']);
          group.save().then(function(updated_group){
          }, function (error) {
            deferred.reject(error);
          });
        }, function(error) {
          deferred.reject(error);
        });
        return deferred.promise;
      }
    };
    return groupServiceFunctions;
  });