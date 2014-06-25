var Prayer = Parse.Object.extend("Prayer", {
  initialize: function(user_id, user_name, user_profile, title, prayer_text, type) {
    this.set("user", user_id);
    this.set("user_name", user_name);
    this.set("user_profile", user_profile);
    this.set("title", title);
    this.set("content", prayer_text);
    this.set("type", type);
    this.set("status", type == "Prayer Request" ? "Open" : "Praise");
    this.set("responses", []);
  },
});

function addPrayer($scope, user_id, user_name, user_profile, title, prayer_text, type) {
	var prayer = new Prayer();
	prayer.initialize(user_id, user_name, user_profile, title, prayer_text, type);
	prayer.save(null, {
		success: function(prayer) {
			var newly_added_prayer = {
				user_name: prayer.get("user_name"),
				title: prayer.get("title")
			};
			$scope.prayers.push(newly_added_prayer);
			$scope.$apply();
		},
		error: function(prayer, error) {
			console.log(error);
		}
	});
	
	// Now update the individual member's prayer list.
	var query = new Parse.Query(Member);
	query.get(user_id, {
		success: function(member) {
			console.log('retrieved ' + member.get("name"));
			member.addUnique("prayers", prayer);
			member.save();
		}
	});
}

var parseModule = angular.module('parseModule', []);

parseModule.factory('PrayerService', function($q) {
	return {
		loadPreviousPrayers: function () {
			var deferred = $q.defer();
			console.log('loadPreviousPrayers');
			var query = new Parse.Query(Prayer);
			// Only fetch fields that are needed
			query.select('user_name', 'title');
			query.find({
				success: function(results) {
					console.log('success with ' + results.length + ' results');
					prayers = [];
					for (var i = 0; i < results.length; i++) {
						var prayer = {
							id: results[i].id,
							user_name: results[i].get("user_name"),
							title: results[i].get("title"),
						};
						prayers.push(prayer);
					}
					deferred.resolve(prayers);
				},
				error: function(error) {
					alert("Error code: " + error.code + ", message: " + error.message);
					deferred.reject(error);
				}
			});
			return deferred.promise;
		}
	}
})