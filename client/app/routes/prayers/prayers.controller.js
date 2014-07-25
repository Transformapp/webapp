'use strict';

angular.module('transformAppApp')
  .controller('PrayersCtrl', function ($scope, PrayerService, UserService) {
	  // determine position/height of list and set it dynamically.
	  var top = $("#prayer-list-container").offset().top;
	  var fontSize = $("#add-prayer").css('font-size');
	  var lineHeight = Math.floor(parseInt(fontSize.replace('px','')) * 7.4);
	  var bottom = $(window).height() - lineHeight;
	  $("#prayer-list-container").css("height",(bottom - top).toString()+ "px");
	  // query all prayers and asynchronously refresh the page when the requests are retrieved from Parse backend.
	  $(".loading").show();
	  var promise = PrayerService.loadAllPrayers();

	  promise.then(function(prayers) {
	    $(".loading").hide();
	    $scope.prayers = prayers;
	  }, function(error) {
	    alert('Failed to load prayers: ' + error);
	  });
	  $scope.title = "Prayers List";
  })
  .controller('PrayerCtrl', function ($scope, $stateParams, PrayerService, UserService) {
	  $("#menuButton").attr('class', 'backButton'); 
	  $(".loading").show();
		$scope.number_of_likes = 0;
	  var promise = PrayerService.loadPrayer($stateParams.prayerId);
	  promise.then(function(prayer) {
	    $(".loading").hide();
	    $scope.prayer = prayer;
	    $scope.has_not_prayed = !(prayer.hasLike(UserService.currentLoggedInUser()));
	  }, function (error) {
	    alert('Failed to load prayer: ' + error);
	  });
	  $scope.addCommentToPrayer = function() {
	    var comment = new Comment(); 
	    comment.user = UserService.currentLoggedInUser();
	    comment.text = $scope.new_comment;
	    var prayer = new Prayer($stateParams.prayer_id);
	    var promise = PrayerService.addCommentToPrayer(prayer, comment);
	    promise.then(function(newly_added_comment) {
	      $scope.prayer.comments.push(newly_added_comment);
	      $scope.new_comment = null; // reset the text box
	    }, function(error) {
	      alert('Failed to add comment to prayer: ' + error);
	    });
	  };
	  $scope.likePrayer = function() {
	    promise = PrayerService.likePrayer($stateParams.prayerId, UserService.currentLoggedInUser().id);
	    promise.then(function(updated_prayer) {
        // Only update the likes here. The updated_prayer object doesn't contain
        // the info about the person who created the prayer, only an ID.
	      $scope.prayer.likes = updated_prayer.likes;
	    });
	  };
  })
  .controller('AddPrayerCtrl', function($scope, $state, PrayerService, UserService){
	  $("#menuButton").attr('class', 'backButton'); 
	  // save prayer
	  $scope.title = "Add A New Prayer/Praise";
	  $scope.master = {};
	  $scope.save = function(p) {
	    $scope.master = angular.copy(p);
	    var newprayer = new Prayer(); 
	    newprayer.user = UserService.currentLoggedInUser(); 
	    newprayer.title = p.title;
	    newprayer.description = p.description;
	    newprayer.type = p.type;
	    // save prayer in backend
	    var promise = PrayerService.addPrayer(newprayer);
	    promise.then(function(prayer) {
	      // navigate back home when done adding
	      $state.go("prayers");
	    }, function (error) {
	      alert('Failed to load prayer: ' + error);
	    });
	  };
  });
