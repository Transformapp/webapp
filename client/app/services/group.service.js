'use strict';

function Group() {
  this.id = null;
  this.name = "";
  this.startTime = null;
  this.durationMins = 0;
  this.users = [];
};

var GroupParseObj = Parse.Object.extend("Group", {
  toObject: function() {
    var obj = new Group();
    obj.id = this.id;
    obj.name = this.get("name");
    obj.startTime = this.get("startTime");
    obj.durationMins = this.get("durationMins");
    obj.location = this.get("location");
    this.get("users").forEach(function(parseUser) {
      obj.users.push(parseUser.toObject());
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
        query.include("users").get(id).then(function(parseGroup) {
          var group = parseGroup.toObject();
          deferred.resolve(group);
        }, function(error){
          deferred.reject(error);
        });
        return deferred.promise;
      }
    };
    return groupServiceFunctions;
  });