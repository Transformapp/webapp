'use strict';

function User() {
  this.id = null;
  this.name = null;
  this.profileUrl = null;
  this.groups = [];
};

var UserParseObj = Parse.Object.extend("User", {
  toObject: function() {
    var obj = new User();
    obj.id = this.id;
    obj.name = this.get("name");
    obj.profileUrl = this.get("profileUrl");
    obj.groups = this.get("groups");
    return obj;
  }
});

angular.module('transformAppApp')
  .service('UserService', function Userservice($q, $state, $rootScope,
																							 localStorageService,
																							 GroupService) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var userServiceFunctions = {
      loadProfile: function(id) {
        var deferred = $q.defer();
        var query = new Parse.Query(UserParseObj);
        query.get(id).then(function(parseUser) {
          var newUser = parseUser.toObject();
          deferred.resolve(newUser);
        });
        return deferred.promise;
      },
      userById: function(id) {
        return localStorageService.get(id);
      },
      currentLoggedInUser: function() {
        return localStorageService.get('mainUser');
      },
      addUserToGroup: function(user, group_id) {
        var deferred = $q.defer();
        var query = new Parse.Query(UserParseObj);
        query.get(user.id).then(function(parseUser) {
          if (parseUser.get("groups") instanceof Array) {
            parseUser.addUnique("groups", group_id).save().then(
              function(parseUserObject) {
                var updated_user = parseUserObject.toObject();
                localStorageService.set(updated_user.id, updated_user);
                if (userServiceFunctions.isCurrentUser(updated_user)) {
                  localStorageService.set('mainUser', updated_user);
                  localStorageService.set('currentGroup', group_id);
                }
                deferred.resolve(updated_user);
              }, function(error) {
                deferred.reject(error);
              }
            );
          }
        });
        return deferred.promise;
      },
      authenticate: function() {
        var deferred = $q.defer();
        Parse.FacebookUtils.logIn("email,public_profile", {
          success: function(parseUserObj) {
            var fbid = parseUserObj.get("authData").facebook.id;
            FB.api('/' + fbid + '?fields=name,picture', function(response) {
              if (response && !response.error) {
                var user = parseUserObj.toObject();
                user.name = response.name;
                user.profileUrl = response.picture.data.url;
                parseUserObj.set('name', user.name);
                parseUserObj.set('profileUrl', user.profileUrl).save();
                localStorageService.set('mainUser', user);
                deferred.resolve(true);
              } else {
                if (!response) {
                  deferred.reject("No response from Facebook graph API");
                } else {
                  deferred.reject(response.error);
                }
              }
            });
          },
          error: function(user, error) {
            deferred.reject(error);
          }
        });
        return deferred.promise;
      },
      logout: function() {
        localStorageService.clearAll();
        // todo: route user back to home
      },
      isCurrentUser: function(user) {
          return user && (user.id == userServiceFunctions.currentLoggedInUser().id);
      },
      loadUserGroupAndMembers: function() {
        var deferred = $q.defer();
				var current_group = localStorageService.get("currentGroup");
				if (current_group) {
					deferred.resolve(true);
				} else {
					var current_user = userServiceFunctions.currentLoggedInUser();
					if (current_user) {
						if (current_user.groups instanceof Array && current_user.groups.length >= 1) {
							// Currently we only support a single group.
							var current_group_id = current_user.groups[0];
							GroupService.loadGroup(current_group_id).then(function(group) {
								localStorageService.set("currentGroup", group);
								localStorageService.set(current_group_id, group);
								group.users.forEach(function(user) {
									localStorageService.set(user.id, user);
								});
								deferred.resolve(true);
							}, function(error) {
								deferred.reject(error);
							});
						}
					} else {
						deferred.reject("No user is logged in.");
					}
				}
				return deferred.promise;
      },
    };
    return userServiceFunctions;
  });
