'use strict';

function User() {
  this.id = null;
  this.name = null;
  this.profileUrl = null;
  this.groups = [];
};

var UserParseObj = Parse.Object.extend("Member", {
  toObject: function() {
    var obj = new User();
    obj.id = this.id;
    obj.name = this.get("name");
    obj.profileUrl = this.get("profileUrl");
    return obj;
  }
});

angular.module('transformAppApp')
  .service('Userservice', function Userservice($q, localStorageService) {
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
    	currentLoggedInUser: function() {
      	// todo: login logic here.  We should do this: http://stackoverflow.com/questions/21355673/defer-angular-ui-router-statechangestart-until-server-authorization-response-re
	      	var u_id = 'Ddw8VGKsZ1'; // TEMP!! set user ID here!
	      	return localStorageService.get(u_id);
    	},
    	isCurrentUser: function(user) {
      		return user.id == userServiceFunctions.currentLoggedInUser().id;
    	},
  	};
  	return userServiceFunctions;
  });
