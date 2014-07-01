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
	this.numberOfLikes = [];
}

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
	this.text = null;
};

function Comment(id, user, text) {
	this.id = id;
	this.user = user;
	this.text = text;
};

parseModule.factory('PrayerService', function($q, localStorageService) {
	// One of the functions in this service needs to call another function
	// in this service. Declaing this local var so that the caller can refer to
	// the callee.
	var prayerServiceFunctions =
	{
		loadComments: function(comment_ids) {
			var deferred = $q.defer();
      var query = new Parse.Query(CommentParseObj);
      query.containedIn("objectId", comment_ids);
			// First fetch all the comments specified by comment_ids.
      query.find().then(function(parseComments) {
				// Now find the author info for each comment to form the final output.
				var comments = [];
				parseComments.forEach(function(parseComment) {
					user = localStorageService.get(parseComment.get("user"));
					comments.push(
						new Comment(parseComment.id, user, parseComment.get("text"))
					);
				});
				deferred.resolve(comments);
			}, function(error) {
				deferred.reject(error);
			});
			return deferred.promise;
		},

		// Returns a Comment object with newly assigned objectID
		addCommentToPrayer: function(prayer, comment) {
			var deferred = $q.defer();
			queryForPrayer = new Parse.Query(PrayerParseObj);
			queryForPrayer.get(prayer.id).then(function(prayer) {
				commentParseObj = new CommentParseObj();
				commentParseObj.initialize(comment.user.id, comment.text);
				commentParseObj.save().then(function(saved_comment) {
					comment.id = saved_comment.id;
					prayer.add("comments", saved_comment.id).save().then(function(updated_prayer) {
						prayer.comments = updated_prayer.get("comments");
						deferred.resolve(comment);
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

		// Returns a Prayer object (via promise) specified by an ID.
		loadPrayer: function(id) {
			var deferred = $q.defer();
			var query = new Parse.Query(PrayerParseObj);
			prayer = new Prayer();
			query.get(id).then(function(result) {
				prayer.id = result.id;
				prayer.user = localStorageService.get(result.get("user"));
				prayer.title = result.get("title");
				prayer.content = result.get("content");
				var comment_ids = result.get("comments");
				return prayerServiceFunctions.loadComments(comment_ids);
			}).then(function(comments) {
				prayer.comments = comments;
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
			query.find().then(function(parsePrayers) {
				parsePrayers.forEach(function(parsePrayer) {
					user_id = parsePrayer.get("user");
					user = localStorageService.get(user_id);
					new_prayer = new Prayer(
						parsePrayer.id,
						user,
						parsePrayer.get("title")
					);
					prayers.push(new_prayer);
				});
				deferred.resolve(prayers);
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
	};
	return prayerServiceFunctions;
})