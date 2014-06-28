var UserParseObj = Parse.Object.extend("Member", {
  initialize: function(name, profile_url) {
    this.set("name", name);
    this.set("profile_url", profile_url);
    this.set("groups", []); // array of group IDs that the user belongs to.
  }
});

function User() {
  this.id = null;
  this.name = null;
  this.profileUrl = null;
}

function User(id, name, profile_url) {
  this.id = id;
  this.name = name;
  this.profileUrl = profile_url;
}

parseModule.factory('UserService', function($q) {
  return {
    loadUser: function(id) {
      var query = new Parse.Query(UserParseObj);
      return query.get(id);
    },
    // Input is an array of user IDs
    loadUsers: function(ids) {
      var query = new Parse.Query(UserParseObj);
      query.containedIn("objectId", ids);
      return query.find();
    },
    loadProfile: function(id) {
      var deferred = $q.defer();
      var query = new Parse.Query(UserParseObj);
      user = {};
      query.get(id).then(function(result) {
        user.id = result.id;
        user.name = result.get("name");
        user.profileUrl = result.get("profileUrl");
        user.groups = result.get("groups");
        deferred.resolve(user);
      });
      return deferred.promise;
    currentLoggedInUser: function() {
      // todo: login logic here.  We should do this: http://stackoverflow.com/questions/21355673/defer-angular-ui-router-statechangestart-until-server-authorization-response-re
      return true;
    }
  };
})