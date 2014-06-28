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
    currentLoggedInUser: function() {
      // todo: login logic here.  We should do this: http://stackoverflow.com/questions/21355673/defer-angular-ui-router-statechangestart-until-server-authorization-response-re
      return true;
    }
  };
})