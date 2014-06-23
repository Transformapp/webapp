var User = Parse.Object.extend("User", {
  initialize: function(name, profile_url, is_leader) {
    this.set("name", name);
    this.set("profile_url", profile_url);
    this.set("is_leader", is_leader);
    this.set("prayers", []);
  }
});
