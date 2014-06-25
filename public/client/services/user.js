var UserParseObj = Parse.Object.extend("User", {
  initialize: function(user) {
    this.set("name", user.name);
    this.set("profile_url", user.profile_url);
    this.set("groups", user.groups); // array of group IDs that the user belongs to.
  }
});
