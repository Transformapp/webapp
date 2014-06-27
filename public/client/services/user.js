var UserParseObj = Parse.Object.extend("Member", {
  initialize: function(name, profile_url) {
    this.set("name", name);
    this.set("profile_url", profile_url);
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
      // return query.get(id);
      user = {};
      query.get(id).then(function(result) {
        user.id = result.id;
        user.name = result.get("name");
        user.profile_url = result.get("profileUrl");
        user.groups = result.get("groups");

        console.log('user: ', user);
        console.log('user.id: ', user.id);
        console.log('user.name: ', user.name);
        console.log('user.profile_url: ', user.profile_url);
        console.log('user.groups: ', user.groups);
        //return user;
      });
      return deferred.promise;

    }
  };
})