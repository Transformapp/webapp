var EventParseObj = Parse.Object.extend("Event", {
  initialize: function(event) {
    this.set("time", event.time);
    this.set("location", event.location);
    this.set("notes", event.notes);
    this.set("attendees", []);
    this.set("losers", []);
    this.set("profile_url", event.profile_url);
  }
});
