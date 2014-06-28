var UserParseObj = Parse.Object.extend("Member", {
  initialize: function(name, profile_url) {
    this.set("name", name);
    this.set("profileUrl", profile_url);
    this.set("groups", []); // array of group IDs that the user belongs to.
  }
});

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
    }
  };
})