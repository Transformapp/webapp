'use strict';

angular.module('transformAppApp')
  .controller('HomeCtrl', function ($scope, $state) {
    // check if menuButton is a menu or a back button
    $("#menuButton").click(function() {
      if ($("#menuButton").hasClass("backButton")){
        $state.go($scope.previousState);
        $("#menuButton").attr('class', 'menuButton');
      }
    });
  });
