'use strict';

function Prayer() {
	this.id = null;
	this.type = null;
	this.status = "Open";
	this.user = null;
	this.title = "";
	this.content = "";
	this.comments = [];
	this.likes = [];
};

function Comment() {
	this.id = null;
	this.user = null;
	this.text = "";
};

var PrayerParseObj = Parse.Object.extend("Prayer", {
	toObject: function() {
		var obj = new Prayer();
		obj.id = this.id;
		obj.type = this.get("type");
		obj.status = this.get("status");
		obj.title = this.get("title");
		obj.content = this.get("content");
		//obj.comments = this.get("comments"); 
		obj.likes = this.get("likes");
		return obj;
	}
});

var CommentParseObj = Parse.Object.extend("Comment", {
	toObject: function() {
		var obj = new Comment();
		obj.id = this.id;
		obj.text = this.get("text");
		return obj;
	}
});

// This is the class of prayer that HTML files can use to display.
// It has no IDs in it and only raw information.

angular.module('transformAppApp')
  .service('PrayerService', function Prayerservice($q, UserService) {
    // AngularJS will instantiate a singleton by calling "new" on this function	
    var prayerServiceFunctions = {
		loadComments: function(comment_ids) {
			var deferred = $q.defer();
      		var query = new Parse.Query(CommentParseObj);
    		query.containedIn("objectId", comment_ids);
			// First fetch all the comments specified by comment_ids.
      		query.find().then(function(parseComments) {
			// Now find the author info for each comment to form the final output.
				var comments = [];
				parseComments.forEach(function(parseComment) {
					var comment = parseComment.toObject();
					comment.user = UserService.userById(parseComment.get("user"));
					comments.push(comment);
				});
				deferred.resolve(comments);
				}, function(error) {
					deferred.reject(error);
			});
			return deferred.promise;
		},

		// Returns the new number of likes for the prayer
		likePrayer: function(prayer, user_id) {
			var deferred = $q.defer();
			var queryForPrayer = new Parse.Query(PrayerParseObj);
			queryForPrayer.get(prayer.id).then(function(prayer) {
				prayer.addUnique("likes", user_id).save().then(function(updated_prayer) {
					deferred.resolve(updated_prayer.get("likes").length);
				}, function(error) {
					deferred.reject(error);
				})
			});
			return deferred.promise;
		},

		// Returns a Comment object with newly assigned objectID
		addCommentToPrayer: function(prayer, comment) {
			var deferred = $q.defer();
			var queryForPrayer = new Parse.Query(PrayerParseObj);
			queryForPrayer.get(prayer.id).then(function(prayer) {
				commentParseObj = new CommentParseObj();
				commentParseObj.set("user", comment.user.id);
				commentParseObj.set("text", comment.text);
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
			var prayer = null;
			query.get(id).then(function(parsePrayerObj) {
				prayer = parsePrayer.toObject();
				prayer.user = UserService.userById(parsePrayerObj.get("user"));						
				return prayerServiceFunctions.loadComments(parsePrayerObj.get("comments"));
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
				parsePrayers.forEach(function(parsePrayerObj) {
					var prayer = parsePrayer.toObject();
					prayer.user = UserService.userById(parsePrayerObj.get("user"));					
					prayers.push(prayer);
				});
				deferred.resolve(prayers);
			}, function(error) {
				deferred.reject(error);
			});
			return deferred.promise;
		},

		// add a new prayer to parse backend
		addPrayer: function(prayer) {
			var deferred = $q.defer();
			var prayerParseObj = new PrayerParseObj();
			prayerParseObj.set("user", prayer.user.id); 
			prayerParseObj.set("title", prayer.title);
			prayerParseObj.set("content", prayer.content);
			prayerParseObj.set("type", prayer.type);
			prayerParseObj.save(null, {
				success: function(prayerParseObj) {
					var prayer = prayerParseObj.toObject();
					deferred.resolve(prayer);
				},
				error: function(prayerParseObj, error) {
					deferred.reject(error);
				}
			});
			return deferred.promise;
		}
	};
	return prayerServiceFunctions;
  });
