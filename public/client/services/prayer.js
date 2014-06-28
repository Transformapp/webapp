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

var CommentParseObj = Parse.Object.extend("Comment", {
	initialize: function(user_id, text) {
		this.set("user", user_id);
		this.set("text", text);
	},
});

// This is the class of prayer that HTML files can use to display.
// It has no IDs in it and only raw information.
function Prayer() {
	this.id = null;
	this.user = new User(); // And this is a User object.
	this.title = null;
	this.content = null;
	this.type = null;
	this.status = null;
	this.comments = [];
	this.numberOfLikes = 0;
};

function Prayer(id,
								user,
								title,
								content,
								type,
								status,
								comments,
								number_of_likes) {
	this.id = id;
	this.user = user; // And this is a User object.
	this.title = title;
	this.content = content;
	this.type = type;
	this.status = status;
	this.comments = comments;
	this.numberOfLikes = number_of_likes;
};

function Comment() {
	this.id = null;
	this.user = null;
	this.content = null;
};

function Comment(id, user, content) {
	this.id = id;
	this.user = user;
	this.content = content;
};

parseModule.factory('PrayerService', function($q, UserService) {
	return {
		loadComments: function(comment_ids) {
      var query = new Parse.Query(CommentParseObj);
      query.containedIn("objectId", ids);
      return query.find();
		},

		addCommentToPrayer: function(prayer_id, comment) {
			var deferred = $q.defer();
			queryForPrayer = new Parse.Query(PrayerParseObj);
			queryForPrayer.get(prayer_id).then(function(prayer) {
				commentParseObj = new CommentParseObj();
				commentParseObj.initialize(comment.user, comment.text);
				commentParseObj.save().then(function(saved) {
					console.log(prayer.id, saved.id);
					prayer.add("comments", saved.id).then(function(updated_prayer) {
						deferred.resolve(updated_prayer);
					}, function (error) {
						deferred.reject(error);
					});
				}, function(error) {
					deferred.reject(error);
				});
			}, function(error) {
				deferred.reject(error);
			});
			return deferred.promise;
		},

		loadPrayer: function(id) {
			var deferred = $q.defer();
			var query = new Parse.Query(PrayerParseObj);
			prayer = new Prayer();
			query.get(id).then(function(result) {
				prayer.id = result.id;
				prayer.title = result.get("title");
				prayer.content = result.get("content");
	      var queryForUser = new Parse.Query(UserParseObj);
				return queryForUser.get(result.get("user"));
			}).then(function(user) {
				prayer.user = new User(user.id, user.get("name"), user.get("profileUrl"));
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
				prayers = results;
				var user_ids = [];
				for (var i = 0; i < results.length; i++) {
					user_ids.push(results[i].get("user"));
				};
				var query = new Parse.Query(UserParseObj);
				query.containedIn("objectId", user_ids);
				return query.find();
			}).then(function(users) {
				var user_array = {};
				for (var i = 0; i < users.length; i++) {
					user_array[users[i].id] = users[i];
				}
				var results = [];
				for (var i = 0; i < prayers.length; i++) {
					var prayer = prayers[i];
					results.push(new Prayer(
						prayer.id,
						new User(user_array[prayer.get("user")].id,
										 user_array[prayer.get("user")].get("name"),
										 user_array[prayer.get("user")].get("profileUrl")),
						prayer.get("title"),
						prayer.get("content"),
						prayer.get("type"),
						prayer.get("status"),
						[], // We are not loading any comments when we load all prayers.
						0   // 
					));
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
			prayerParseObj.initialize(prayer.user.id, prayer.title, prayer.content, prayer.type);
			prayerParseObj.save(null, {
				success: function(prayerParseObj) {
					deferred.resolve(new Prayer(
						prayerParseObj.id,
						prayer.user,
						prayer.title,
						prayer.content,
						prayer.type,
						prayerParseObj.get("status"),
						[],
						0
					));
				},
				error: function(prayerParseObj, error) {
					deferred.reject(error);
				}
			});
			return deferred.promise;
		}
	}
})