var UserParseObj = Parse.Object.extend("Member", {
  initialize: function(name, profile_url) {
    this.set("name", name);
    this.set("profileUrl", profile_url);
    this.set("groups", []); // array of group IDs that the user belongs to.
  }
});

function User() {
  this.id = null;
  this.name = null;
  this.profileUrl = null;
  this.groups = [];
};

function User(id, name, profile_url, groups) {
  this.id = id;
  this.name = name;
  this.profileUrl = profile_url;
  this.groups = groups;
};

parseModule.factory('UserService', function($q, localStorageService) {
  return {
    loadAllUsers: function() {
      var deferred = $q.defer();
      var query = new Parse.Query(UserParseObj);
      var users = [];
      query.find().then(function(parseUsers) {
        parseUsers.forEach(function(parseUser) {
          new_user = new User(parseUser.id,
                              parseUser.get("name"),
                              parseUser.get("profileUrl"));
          users.push(new_user);
        });
        deferred.resolve(users);
      }, function(error){
        deferred.reject(error);
      });
      return deferred.promise;
    },

    loadProfile: function(id) {
      var deferred = $q.defer();
      var query = new Parse.Query(UserParseObj);
      user = {};
      query.get(id).then(function(result) {
        newUser = new User(result.id, result.get("name"), result.get("profileUrl"), result.get("groups"))
        deferred.resolve(newUser);
      });
      return deferred.promise;
    },
    currentLoggedInUser: function() {
      // todo: login logic here.  We should do this: http://stackoverflow.com/questions/21355673/defer-angular-ui-router-statechangestart-until-server-authorization-response-re
      var u_id = 'Ddw8VGKsZ1'; // TEMP!! set user ID here!
      return localStorageService.get(u_id);
    }
  };
})