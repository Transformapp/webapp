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
  });
