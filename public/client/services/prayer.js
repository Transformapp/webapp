// Definition for Prayer database on parse.
var PrayerParseObj = Parse.Object.extend("Prayer", {
  initialize: function(user_id, title, content, type) {
    this.set("user", user_id);
    this.set("title", title);
    this.set("content", content);
    this.set("type", type);
    this.set("status", type == "Prayer Request" ? "Open" : "Praise");
    this.set("comments", []);
		this.set("likes", []);
  },
});

parseModule.factory('PrayerService', function($q, UserService) {
	return {
		loadPrayer: function(id) {
			var deferred = $q.defer();
			var query = new Parse.Query(PrayerParseObj);
			var prayer = {};
			query.get(id).then(function(result) {
				prayer.id = result.id;
				prayer.title = result.get("title");
				prayer.content = result.get("content");
				return UserService.loadUser(result.get("user"))
			}).then(function(user) {
				prayer.user_name = user.get("name");
				prayer.user_profile = user.get("profileUrl");
				deferred.resolve(prayer);
			}, function(error) {
				deferred.reject(error);
			});
			return deferred.promise;
		},
		loadAllPrayers: function () {
			var deferred = $q.defer();
			var query = new Parse.Query(PrayerParseObj);
			var prayers = [];
			// Only fetch fields that are needed
			query.select('user', 'title');
			query.find().then(function(results) {
				console.log('success with ' + results.length + ' results');
				prayers = results;
				var users = [];
				for (var i = 0; i < results.length; i++) {
					users.push(results[i].get("user"));
				};
				return UserService.loadUsers(users);
			}).then(function(users) {
				var user_array = {};
				for (var i = 0; i < users.length; i++) {
					user_array[users[i].id] = users[i];
				}
				var results = [];
				for (var i = 0; i < prayers.length; i++) {
					var prayer = prayers[i];
					results.push({
						id: prayer.id,
						user_name: user_array[prayer.get("user")].get("name"),
						title: prayer.get("title")
					});
				};
				deferred.resolve(results);
			}, function(error) {
				deferred.reject(error);
			});
			return deferred.promise;
		},

		/**
		 * Function to add a new prayer to parse backend
		 */
		addPrayer: function(prayer) {
			var deferred = $q.defer();
			var prayerParseObj = new PrayerParseObj();
			prayerParseObj.initialize(prayer.user_id, prayer.title, prayer.content, prayer.type);
			prayerParseObj.save(null, {
				success: function(prayerParseObj) {
					deferred.resolve(prayerParseObj);
				},
				error: function(prayerParseObj, error) {
					deferred.reject(error);
				}
			});
			return deferred.promise;
		}
	}
})

// Add a new prayer/praise
function addPrayer(){
	// create prayer object
	var newPrayer = Parse.Object.extend("Prayer", {
	  initialize: function(user_id, title, content, type) {
	    this.set("user", user_id);
	    this.set("title", title);
	    this.set("content", content);
	    this.set("type", type);
	    this.set("status", type == "Prayer Request" ? "Open" : "Praise");
	    this.set("comments", []);
			this.set("likes", []);
	  },
	});
	// feed into add prayer factory function
	// update UI

	alert('added a new prayer!');
}
// Create Add Prayer popup
function prayerPopup(){
	// create popup
	// call addPrayer()
	addPrayer();
}
// Add a new comment to a prayer/praise
function addComment(){
	alert('added a new comment!');
}
// Like clicked!
function likeButton(){
	alert('liked a comment!');
}