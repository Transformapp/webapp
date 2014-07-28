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
    return obj;
  }
});

angular.module('transformAppApp')
  .service('UserService', function Userservice($q, $state, localStorageService) {
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
      authenticate: function() {
        var deferred = $q.defer();
        Parse.FacebookUtils.logIn("email,public_profile", {
          success: function(parseUserObj) {
						var fbid = parseUserObj.get("authData").facebook.id;
						FB.api('/' + fbid + '?fields=name,picture', function(response) {
							if (!response || !response.name || !response.picture) {
								deferred.reject('Failed to acquire user name and profile picture');
							} else {
								var user = parseUserObj.toObject();
								user.name = response.name;
								user.profileUrl = response.picture.data.url;
								parseUserObj.set('name', user.name);
								parseUserObj.set('profileUrl', user.profileUrl).save();
								localStorageService.set('mainUser', user);
								deferred.resolve(true);
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
  	};
  	return userServiceFunctions;
  });
